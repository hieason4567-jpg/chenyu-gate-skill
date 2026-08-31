# 辰屿剧本格式校对（免费版）一行安装（Windows）：
#   irm https://raw.githubusercontent.com/hieason4567-jpg/chenyu-gate-skill/main/install.ps1 | iex
# 装到 Codex + Claude Code 的 skills 目录，并创建全局 chenyu-gate 命令。需 Node 18+。
$ErrorActionPreference = "Stop"
$repo = "https://raw.githubusercontent.com/hieason4567-jpg/chenyu-gate-skill/main"
$files = @("SKILL.md", "scripts/chenyu_gate_cli.mjs")

$roots = @()
$roots += Join-Path $env:USERPROFILE ".codex\skills"
$roots += Join-Path $env:USERPROFILE ".claude\skills"

$primary = ""
foreach ($root in $roots) {
  $dest = Join-Path $root "chenyu-gate"
  New-Item -ItemType Directory -Force (Join-Path $dest "scripts") | Out-Null
  foreach ($f in $files) {
    $target = Join-Path $dest ($f -replace "/", "\")
    Invoke-WebRequest -UseBasicParsing -Uri "$repo/$f" -OutFile $target
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
& node $cliPath version
Write-Host ""
Write-Host "Install complete. Usage:" -ForegroundColor Green
Write-Host "  chenyu-gate --file script.txt"
exit 0
