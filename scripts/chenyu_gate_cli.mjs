#!/usr/bin/env node
// 辰屿剧本工具 免费版（chenyu-gate）—— 纯本地、不联网、不用账号。
// 和辰屿 Pro 用同一份程序（chenyu_pro_cli.mjs），以免费版模式运行：只开放不需要账号的命令
// （格式门、洗稿检查、交付检查、改名、资产整理与形象表、原片时长、已分镜工程改写），
// 视频反推、形象设计、平台交付需要辰屿 Pro。Pro 更新后这里同步替换同名文件即可保持一致。
process.env.CHENYU_EDITION = 'gate';
await import('./chenyu_pro_cli.mjs');
