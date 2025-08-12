# Turbopack Performance Monitor Script (PowerShell)
# Monitors development server performance and build times

Write-Host "🚀 Turbopack Performance Monitor" -ForegroundColor Green
Write-Host "=================================="

# Check if development server is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Development server is running on http://localhost:3000" -ForegroundColor Green
    Write-Host "   Status Code: $($response.StatusCode)"
} catch {
    Write-Host "❌ Development server is not running" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)"
}

# Monitor memory usage
Write-Host ""
Write-Host "📊 Memory Usage:" -ForegroundColor Cyan
Write-Host "Node.js processes:"
Get-Process -Name "node" -ErrorAction SilentlyContinue | Format-Table Name, Id, CPU, WorkingSet -AutoSize

# Check build cache
Write-Host ""
Write-Host "📁 Build Cache Status:" -ForegroundColor Cyan
if (Test-Path ".next") {
    $cacheSize = (Get-ChildItem ".next" -Recurse | Measure-Object -Property Length -Sum).Sum
    $cacheSizeMB = [math]::Round($cacheSize / 1MB, 2)
    Write-Host "✅ Build cache exists: $cacheSizeMB MB" -ForegroundColor Green
    Write-Host "   Cache location: $(Resolve-Path '.next')"
} else {
    Write-Host "❌ No build cache found" -ForegroundColor Yellow
}

# Check environment variables
Write-Host ""
Write-Host "🔧 Turbopack Configuration:" -ForegroundColor Cyan
$envVars = @(
    "TURBOPACK_BUILD_CACHE",
    "TURBOPACK_EXPERIMENTAL_MEMORY_LIMIT", 
    "NEXT_PRIVATE_TURBOPACK",
    "NODE_OPTIONS"
)

foreach ($var in $envVars) {
    $value = [Environment]::GetEnvironmentVariable($var)
    if ($value) {
        Write-Host "   $var = $value" -ForegroundColor Green
    }
}

# Performance tips
Write-Host ""
Write-Host "💡 Turbopack Performance Tips:" -ForegroundColor Yellow
Write-Host "  • Use 'npm run dev' for standard Turbopack development"
Write-Host "  • Use 'npm run dev:fast' for network access"
Write-Host "  • Use 'npm run dev:webpack' if Turbopack has issues"
Write-Host "  • Clear cache with: Remove-Item -Recurse -Force .next"

Write-Host ""
Write-Host "🔗 Useful URLs:" -ForegroundColor Magenta
Write-Host "  • Local: http://localhost:3000"
Write-Host "  • Network: http://192.168.1.8:3000"

# Check package.json scripts
Write-Host ""
Write-Host "📋 Available Scripts:" -ForegroundColor Cyan
if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    $packageJson.scripts.PSObject.Properties | Where-Object { $_.Name -like "*dev*" } | ForEach-Object {
        Write-Host "   npm run $($_.Name): $($_.Value)" -ForegroundColor White
    }
}

Write-Host ""
