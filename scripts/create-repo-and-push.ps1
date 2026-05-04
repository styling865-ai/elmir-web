# Creates github.com/styling865-ai/elmir-web (if missing) and pushes main.
# Usage (PowerShell):
#   $env:GITHUB_TOKEN = "ghp_your_token_here"   # classic PAT: repo scope
#   cd c:\Users\USER\Desktop\ELMIR
#   .\scripts\create-repo-and-push.ps1

$ErrorActionPreference = "Stop"
$repo = "elmir-web"
$owner = "styling865-ai"
$token = $env:GITHUB_TOKEN
if (-not $token) {
  Write-Host "Set GITHUB_TOKEN first (GitHub -> Settings -> Developer settings -> PAT, scope: repo)." -ForegroundColor Yellow
  exit 1
}

$headers = @{
  Authorization = "Bearer $token"
  Accept        = "application/vnd.github+json"
  "User-Agent"  = "elmir-web-setup"
}

$exists = $false
try {
  Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repo" -Headers $headers -Method Get | Out-Null
  $exists = $true
  Write-Host "Repo $owner/$repo already exists."
}
catch {
  if ($_.Exception.Response.StatusCode -ne 404) { throw }
}

if (-not $exists) {
  $body = @{ name = $repo; private = $false; auto_init = $false } | ConvertTo-Json
  Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Headers $headers -Method Post -Body $body -ContentType "application/json"
  Write-Host "Created https://github.com/$owner/$repo"
}

Set-Location (Join-Path $PSScriptRoot "..")
git remote remove origin 2>$null
git remote add origin "https://github.com/$owner/$repo.git"
git push -u origin main
Write-Host "Done. Pushed main to origin."
