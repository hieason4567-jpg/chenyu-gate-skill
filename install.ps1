# 辰屿技能 v2.40.0 一行安装（Windows）：
#   irm https://raw.githubusercontent.com/hieason4567-jpg/chenyu-gate-skill/main/install.ps1 | iex
# 合并版：原 chenyu-pro + chenyu-gate 合为一个技能 chenyu。
# 装到 Codex + Claude Code 的 skills 目录，并创建全局命令 chenyu（另附 chenyu-pro / chenyu-gate 兼容命令）。需 Node 18+。
$ErrorActionPreference = "Stop"
$repo = "https://raw.githubusercontent.com/hieason4567-jpg/chenyu-gate-skill/main"
$skillName = "chenyu"
$files = @(
  "SKILL.md",
  "references/分镜写作守则.md",
  "scripts/chenyu_cli.mjs",
  "scripts/chenyu_pro_cli.mjs",
  "scripts/chenyu_gate_cli.mjs",
  "scripts/net.mjs",
  "scripts/asset_workbook.mjs",
  "scripts/asset_export.mjs",
  "scripts/asset_semantics.mjs",
  "scripts/wash_check.mjs",
  "scripts/deliver_check.mjs",
  "scripts/variant_candidates.mjs",
  "scripts/merge_review.mjs",
  "scripts/text_analyze.mjs",
  "scripts/durations.mjs",
  "scripts/remake.mjs",
  "scripts/excel_import.mjs",
  "scripts/storyboard_audit.mjs",
  "scripts/styling_audit.mjs",
  "scripts/styling_static.json"
)

$roots = @()
$roots += Join-Path $env:USERPROFILE ".codex\skills"
$roots += Join-Path $env:USERPROFILE ".claude\skills"

$primary = ""
foreach ($root in $roots) {
  $dest = Join-Path $root $skillName
  New-Item -ItemType Directory -Force $dest | Out-Null
  foreach ($f in $files) {
    $target = Join-Path $dest ($f -replace "/", "\")
    New-Item -ItemType Directory -Force (Split-Path $target) | Out-Null
    $url = [uri]::EscapeUriString("$repo/$f")
    Invoke-WebRequest -UseBasicParsing -Uri $url -OutFile $target
  }
  if (-not $primary) { $primary = $dest }
  Write-Host "  Skill installed -> $dest"
}

$binDir = Join-Path $env:USERPROFILE ".codex\bin"
New-Item -ItemType Directory -Force $binDir | Out-Null
$cliPath = Join-Path $primary "scripts\chenyu_cli.mjs"

# 路径用 %USERPROFILE% 在运行时展开：用户名含中文时，写死的路径经 ASCII 编码会变成问号，命令就坏了
foreach ($cmd in @("chenyu", "chenyu-pro", "chenyu-gate")) {
  Set-Content -Path (Join-Path $binDir "$cmd.cmd") -Encoding ascii -Value "@echo off`r`nnode `"%USERPROFILE%\.codex\skills\chenyu\scripts\chenyu_cli.mjs`" %*"
  Write-Host "  Command created -> $binDir\$cmd.cmd"
}

$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*$binDir*") {
  [Environment]::SetEnvironmentVariable("Path", "$userPath;$binDir", "User")
  Write-Host "  PATH updated (new terminals will have chenyu)"
}

Write-Host ""
Write-Host "Install complete (chenyu v2.40.0)." -ForegroundColor Green
# 使用说明：node 直接写终端（不经过管道，避免 PowerShell 把中文转成乱码）
& node $cliPath guide
# 不要 exit：用 irm | iex 运行时 exit 会直接关掉用户的 PowerShell 窗口，看不到安装结果
