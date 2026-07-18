const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'RelationMap.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace node background
content = content.replace(/background: 'rgba\(8,11,20,0\.95\)'/g, "background: 'var(--bg-card)'");

// Replace Controls and MiniMap background
content = content.replace(/background: 'rgba\(8,11,20,0\.9\)'/g, "background: 'var(--bg-card)'");

// Replace Background dots color
content = content.replace(/color="rgba\(0,212,255,0\.06\)"/g, 'color="rgba(0,0,0,0.1)"');

fs.writeFileSync(filePath, content, 'utf8');
console.log('RelationMap.jsx updated successfully.');
