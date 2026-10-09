const fs = require('fs');
const path = 'c:/Users/Admin/.vscode/Math/layout.html';
let content = fs.readFileSync(path, 'utf8');
const now = Date.now();
// Replace plain src="frameXX.svg" with src="frameXX.svg?v=TIMESTAMP"
// Also handle existing query params if any
content = content.replace(/src="(frame\d+\.svg)(\?v=\d+)?"/g, `src="$1?v=${now}"`);
fs.writeFileSync(path, content);
console.log('Updated layout.html with cache busters');
