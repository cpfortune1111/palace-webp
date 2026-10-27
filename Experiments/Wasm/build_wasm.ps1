param([Parameter(Mandatory=$true)][string]$Source,[Parameter(Mandatory=$true)][string]$Go,[Parameter(Mandatory=$true)][string]$Out)
$ErrorActionPreference = 'Stop'
$sourcePath = (Resolve-Path -LiteralPath $Source).Path
$goPath = (Resolve-Path -LiteralPath $Go).Path
$outputPath = [IO.Path]::GetFullPath($Out)
if ((& $goPath version) -notmatch 'go1\.27\.3 ') { throw 'Expected pinned Go 1.27.3' }
New-Item -ItemType Directory -Force -Path $outputPath | Out-Null
$env:GOOS='js'; $env:GOARCH='wasm'; $env:CGO_ENABLED='0'; $env:GOEXPERIMENT='arenas'; $env:GOTOOLCHAIN='local'
Push-Location -LiteralPath $sourcePath
try {
    & $goPath build -trimpath -buildvcs=false -ldflags '-s -w -X main.Version=moon-palace-v1.0.0-wasm -X main.BuildTime=2026.10.27' -o (Join-Path $outputPath 'ikemen.wasm') ./src
    if ($LASTEXITCODE -ne 0) { throw 'WASM compilation failed' }
    $runtimeRoot = & $goPath env GOROOT
    Copy-Item -LiteralPath (Join-Path $runtimeRoot 'lib/wasm/wasm_exec.js') -Destination (Join-Path $outputPath 'wasm_exec.js')
    Copy-Item -LiteralPath (Join-Path $sourcePath 'build/wasm/fs-shim.js') -Destination $outputPath
    Copy-Item -LiteralPath (Join-Path $sourcePath 'LICENCE.txt') -Destination $outputPath
    Get-FileHash -Algorithm SHA256 -LiteralPath (Join-Path $outputPath 'ikemen.wasm'),(Join-Path $outputPath 'wasm_exec.js') | Format-Table
} finally { Pop-Location }
