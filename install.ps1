# 辰屿剧本工具（免费版）一行安装（Windows）：
#   irm https://raw.githubusercontent.com/hieason4567-jpg/chenyu-gate-skill/main/install.ps1 | iex
# 装到 Codex + Claude Code 的 skills 目录，并创建全局 chenyu-gate 命令。需 Node 18+。
$ErrorActionPreference = "Stop"
$repo = "https://raw.githubusercontent.com/hieason4567-jpg/chenyu-gate-skill/main"
$files = @("SKILL.md", "scripts/chenyu_gate_cli.mjs", "scripts/chenyu_pro_cli.mjs", "scripts/net.mjs", "scripts/asset_workbook.mjs", "scripts/wash_check.mjs", "scripts/deliver_check.mjs", "scripts/asset_export.mjs", "scripts/variant_candidates.mjs", "scripts/merge_review.mjs", "scripts/durations.mjs", "scripts/remake.mjs", "scripts/styling_static.json", "scripts/excel_import.mjs", "scripts/storyboard_audit.mjs", "scripts/superi_lookup.mjs", "references/分镜写作守则.md")

$roots = @()
$roots += Join-Path $env:USERPROFILE ".codex\skills"
$roots += Join-Path $env:USERPROFILE ".claude\skills"

$primary = ""
foreach ($root in $roots) {
  $dest = Join-Path $root "chenyu-gate"
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
$cliPath = Join-Path $primary "scripts\chenyu_gate_cli.mjs"
Set-Content -Path (Join-Path $binDir "chenyu-gate.cmd") -Encoding ascii -Value "@echo off`r`nnode `"$cliPath`" %*"
Write-Host "  Command created -> $binDir\chenyu-gate.cmd"

$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*$binDir*") {
  [Environment]::SetEnvironmentVariable("Path", "$userPath;$binDir", "User")
  Write-Host "  PATH updated (new terminals will have chenyu-gate)"
}

Write-Host ""
Write-Host "Install complete." -ForegroundColor Green
# 使用说明：node 直接写终端（不经过管道，避免 PowerShell 把中文转成乱码）
& node $cliPath guide
# 不要 exit：用 irm | iex 运行时 exit 会直接关掉用户的 PowerShell 窗口，看不到安装结果
