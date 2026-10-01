// 网络层（零依赖）：直连优先，连不上自动改走系统代理重试。
// Node 自带 fetch 不读代理设置（HTTP_PROXY 等环境变量、Windows 注册表里的系统代理都不认），
// 所以这里自己找代理、用 HTTP CONNECT 隧道转发，替换全局 fetch，CLI 里所有请求自动受益。
// - 先直连；网络层失败（连接超时/拒绝/重置/DNS 失败）且找得到代理时，经代理重试；代理通了，本次运行后续请求都走代理。
// - CHENYU_PROXY=http://host:port 指定代理；CHENYU_KEEP_PROXY=1 一开始就走系统代理。
import http from 'node:http';
import https from 'node:https';
import tls from 'node:tls';
import { spawnSync } from 'node:child_process';

const nativeFetch = globalThis.fetch.bind(globalThis);

// 环境变量里的代理要在 CLI 清掉它们之前取（本模块先于 CLI 顶层代码执行）
const ENV_PROXY = ['CHENYU_PROXY', 'HTTPS_PROXY', 'https_proxy', 'HTTP_PROXY', 'http_proxy', 'ALL_PROXY', 'all_proxy']
  .map((k) => String(process.env[k] || '').trim()).find(Boolean) || '';
const PREFER_PROXY = Boolean(process.env.CHENYU_PROXY || process.env.CHENYU_KEEP_PROXY);

let cachedProxy;
function normalizeProxy(value) {
  const v = String(value || '').trim();
  if (!v) return '';
  if (/^socks/i.test(v)) return ''; // 只支持 HTTP 代理（Clash/V2Ray 等的混合端口也接受 HTTP CONNECT）
  return /^https?:\/\//i.test(v) ? v : `http://${v}`;
}

function windowsSystemProxy() {
  try {
    const key = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings';
    const enable = spawnSync('reg', ['query', key, '/v', 'ProxyEnable'], { encoding: 'utf8', windowsHide: true }).stdout || '';
    if (!/ProxyEnable\s+REG_DWORD\s+0x1\b/i.test(enable)) return '';
    const server = (spawnSync('reg', ['query', key, '/v', 'ProxyServer'], { encoding: 'utf8', windowsHide: true }).stdout || '')
      .match(/ProxyServer\s+REG_SZ\s+(\S+)/i)?.[1] || '';
    if (!server) return '';
    // 「127.0.0.1:7890」或「http=127.0.0.1:7890;https=127.0.0.1:7890」
    const parts = Object.fromEntries(server.split(';').map((p) => p.split('=')).filter((p) => p.length === 2));
    return parts.https || parts.http || (server.includes('=') ? '' : server);
  } catch { return ''; }
}

function macSystemProxy() {
  try {
    const out = spawnSync('scutil', ['--proxy'], { encoding: 'utf8' }).stdout || '';
    for (const kind of ['HTTPS', 'HTTP']) {
      if (new RegExp(`${kind}Enable\\s*:\\s*1`).test(out)) {
        const host = out.match(new RegExp(`${kind}Proxy\\s*:\\s*(\\S+)`))?.[1];
        const port = out.match(new RegExp(`${kind}Port\\s*:\\s*(\\d+)`))?.[1];
        if (host && port) return `${host}:${port}`;
      }
    }
  } catch { /* 没有 scutil */ }
  return '';
}

export function findSystemProxy() {
  if (cachedProxy !== undefined) return cachedProxy;
  cachedProxy = normalizeProxy(ENV_PROXY)
    || normalizeProxy(process.platform === 'win32' ? windowsSystemProxy() : process.platform === 'darwin' ? macSystemProxy() : '');
  return cachedProxy;
}

function connectViaProxy(proxyUrl, host, port, timeoutMs) {
  const proxy = new URL(proxyUrl);
  const headers = { Host: `${host}:${port}` };
  if (proxy.username) headers['Proxy-Authorization'] = 'Basic ' + Buffer.from(`${decodeURIComponent(proxy.username)}:${decodeURIComponent(proxy.password)}`).toString('base64');
  return new Promise((resolve, reject) => {
    const req = http.request({ host: proxy.hostname, port: Number(proxy.port || 80), method: 'CONNECT', path: `${host}:${port}`, headers, timeout: timeoutMs });
    req.on('connect', (res, socket) => {
      if (res.statusCode !== 200) { socket.destroy(); reject(new Error(`代理 CONNECT 失败 HTTP ${res.statusCode}`)); return; }
      resolve(socket);
    });
    req.on('timeout', () => req.destroy(new Error('代理连接超时')));
    req.on('error', reject);
    req.end();
  });
}

async function bodyToBuffer(body) {
  if (body === undefined || body === null) return null;
  if (typeof body === 'string') return Buffer.from(body);
  if (Buffer.isBuffer(body)) return body;
  if (body instanceof Uint8Array) return Buffer.from(body.buffer, body.byteOffset, body.byteLength);
  if (body instanceof ArrayBuffer) return Buffer.from(body);
  if (typeof body.arrayBuffer === 'function') return Buffer.from(await body.arrayBuffer());
  return Buffer.from(await new Response(body).arrayBuffer());
}

/** 经 HTTP 代理（CONNECT 隧道）发一个请求，返回标准 Response */
export async function proxyFetch(input, init = {}, proxyUrl = findSystemProxy()) {
  const url = new URL(typeof input === 'string' ? input : input.url);
  const method = String(init.method || 'GET').toUpperCase();
  const headers = Object.fromEntries(new Headers(init.headers || {}).entries());
  const payload = await bodyToBuffer(init.body);
  if (payload && headers['content-length'] === undefined) headers['content-length'] = String(payload.length);
  const isHttps = url.protocol === 'https:';
  const port = Number(url.port || (isHttps ? 443 : 80));
  const timeoutMs = 30000;
  const socket = await connectViaProxy(proxyUrl, url.hostname, port, timeoutMs);
  return new Promise((resolve, reject) => {
    const signal = init.signal;
    const opts = { method, path: url.pathname + url.search, headers: { host: url.host, ...headers }, createConnection: () => (isHttps ? tls.connect({ socket, servername: url.hostname }) : socket) };
    // 不传 agent：Node 在 agent 未设置且给了 createConnection 时才用我们的隧道连接（agent:false 会另建默认 Agent、绕过隧道）
    const req = (isHttps ? https : http).request(opts);
    const onAbort = () => req.destroy(signal.reason || new Error('aborted'));
    if (signal) { if (signal.aborted) return onAbort(); signal.addEventListener('abort', onAbort, { once: true }); }
    req.on('response', (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        signal?.removeEventListener('abort', onAbort);
        const h = new Headers();
        for (const [k, v] of Object.entries(res.headers)) for (const one of [].concat(v)) h.append(k, String(one));
        const status = res.statusCode || 0;
        const nullBody = [101, 204, 205, 304].includes(status);
        resolve(new Response(nullBody ? null : Buffer.concat(chunks), { status, statusText: res.statusMessage || '', headers: h }));
      });
      res.on('error', reject);
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

const NETWORK_ERROR_RE = /fetch failed|ECONNREFUSED|ECONNRESET|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|ENETUNREACH|EHOSTUNREACH|UND_ERR_CONNECT_TIMEOUT|UND_ERR_SOCKET|socket hang up|Connect Timeout/i;
const isNetworkError = (e) => e && (e.name === 'TypeError' || e.name === 'TimeoutError') && NETWORK_ERROR_RE.test(`${e.message} ${e.cause?.code || ''} ${e.cause?.message || ''} ${e.name}`);

let useProxy = PREFER_PROXY && Boolean(findSystemProxy());
let announced = false;
const announce = (why) => {
  if (announced) return;
  announced = true;
  const p = findSystemProxy().replace(/\/\/[^@/]*@/, '//***@');
  console.error(`  （网络：${why}，改走系统代理 ${p}）`);
};

/** 直连优先；网络层失败且有系统代理时经代理重试，代理通了本次运行后续都走代理 */
export async function netFetch(input, init = {}) {
  if (useProxy) { announce('已设为优先走代理'); return proxyFetch(input, init); }
  try {
    return await nativeFetch(input, init);
  } catch (e) {
    if (!isNetworkError(e) || !findSystemProxy() || init?.signal?.aborted && e.name !== 'TimeoutError') throw e;
    const res = await proxyFetch(input, { ...init, signal: undefined });
    useProxy = true;
    announce('直连失败');
    return res;
  }
}

globalThis.fetch = netFetch;
