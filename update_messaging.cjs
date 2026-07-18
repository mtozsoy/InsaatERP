const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'Messaging.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace sidebar background
content = content.replace(/background: 'rgba\(6,8,18,0\.97\)'/g, "background: 'var(--bg-card)'");
content = content.replace(/rgba\(255,255,255,0\.06\)/g, "var(--border-subtle)");
content = content.replace(/rgba\(255,255,255,0\.08\)/g, "var(--border-subtle)");
// Replace active button background
content = content.replace(/rgba\(0,212,255,0\.12\)/g, "rgba(59,130,246,0.12)");
// Replace inactive button color
content = content.replace(/rgba\(255,255,255,0\.55\)/g, "var(--text-secondary)");
content = content.replace(/rgba\(255,255,255,0\.4\)/g, "var(--text-muted)");
// Replace chat area background
content = content.replace(/background: 'rgba\(8,11,20,0\.95\)'/g, "background: 'var(--bg-body)'");
// Send button inactive text color
content = content.replace(/rgba\(255,255,255,0\.2\)/g, "var(--text-muted)");

fs.writeFileSync(filePath, content, 'utf8');
console.log('Messaging.jsx updated successfully.');
