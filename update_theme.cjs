const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('C:/Users/Mete/Desktop/InsaatERP/src', function(filePath) {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Text colors
    content = content.replace(/color:\s*['"]white['"]/g, "color: 'var(--text-primary)'");
    content = content.replace(/color:\s*['"]rgba\(255,\s*255,\s*255,\s*0\.([0-9]+)\)['"]/g, (match, op) => {
        const opacity = parseFloat("0." + op);
        if(opacity >= 0.7) return "color: 'var(--text-primary)'";
        if(opacity >= 0.4) return "color: 'var(--text-secondary)'";
        return "color: 'var(--text-muted)'";
    });

    // Backgrounds
    content = content.replace(/background:\s*['"]rgba\(10,\s*13,\s*24,\s*0\.\d+\)['"]/g, "background: 'var(--bg-card)'");
    content = content.replace(/background:\s*['"]rgba\(9,\s*12,\s*22,\s*0\.\d+\)['"]/g, "background: 'var(--bg-card)'");
    content = content.replace(/background:\s*['"]rgba\(255,\s*255,\s*255,\s*0\.0[0-9]+\)['"]/g, "background: 'var(--glass-bg)'");

    // Borders
    content = content.replace(/border:\s*['"]1px solid rgba\(255,\s*255,\s*255,\s*0\.\d+\)['"]/g, "border: '1px solid var(--border-subtle)'");

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
