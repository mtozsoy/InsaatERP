const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
}

const targetString = "background: 'rgba(15,20,35,0.95)', border: '1px solid var(--border-subtle)', borderRadius: 16, width: 450, padding: 24, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'";
const replacementString = "background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, width: 450, padding: 24, boxShadow: 'var(--shadow-lg)'";

const altTargetString = "background: 'rgba(15,20,35,0.95)', border: '1px solid var(--border-subtle)', borderRadius: 16, width: 400, padding: 24, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'";
const altReplacementString = "background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, width: 400, padding: 24, boxShadow: 'var(--shadow-lg)'";


walk(path.join(__dirname, 'src', 'pages'), (filePath) => {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    if (content.includes(targetString)) {
      content = content.replace(new RegExp(targetString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacementString);
      changed = true;
    }
    
    if (content.includes(altTargetString)) {
      content = content.replace(new RegExp(altTargetString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), altReplacementString);
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated modals in ${path.basename(filePath)}`);
    }
  }
});

console.log("Modal theme updates completed.");
