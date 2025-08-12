#!/bin/bash

# Turbopack Performance Monitor Script
# Monitors development server performance and build times

echo "🚀 Turbopack Performance Monitor"
echo "=================================="

# Check if development server is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Development server is running on http://localhost:3000"
else
    echo "❌ Development server is not running"
    exit 1
fi

# Monitor memory usage
echo ""
echo "📊 Memory Usage:"
echo "Node.js processes:"
tasklist /FI "IMAGENAME eq node.exe" /FO TABLE

# Check build cache
echo ""
echo "📁 Build Cache Status:"
if [ -d ".next" ]; then
    cache_size=$(du -sh .next 2>/dev/null | cut -f1)
    echo "✅ Build cache exists: $cache_size"
else
    echo "❌ No build cache found"
fi

# Performance tips
echo ""
echo "💡 Turbopack Performance Tips:"
echo "  • Use 'npm run dev' for standard Turbopack development"
echo "  • Use 'npm run dev:fast' for network access"
echo "  • Use 'npm run dev:webpack' if Turbopack has issues"
echo "  • Clear cache with: Remove-Item -Recurse -Force .next"

echo ""
echo "🔗 Useful URLs:"
echo "  • Local: http://localhost:3000"
echo "  • Network: http://192.168.1.8:3000"
echo ""
