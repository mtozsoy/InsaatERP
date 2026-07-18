const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

const colorMap = {
  '#00D4FF': '#3b82f6', // Pastel Cyan/Blue
  '#7B2FFF': '#818cf8', // Pastel Purple/Indigo
  '#FF6B35': '#fb923c', // Pastel Orange
  '#00FFB3': '#34d399', // Pastel Green
  '#FFD93D': '#fbbf24', // Pastel Yellow
  '#FF4D6D': '#f87171', // Pastel Red
  'rgba(255, 255, 255, 0.1)': '#e2e8f0', // Grid lines
  'rgba(255,255,255,0.1)': '#e2e8f0', // Grid lines
  'rgba(255,255,255,0.05)': '#e2e8f0', // Grid lines
  'rgba(255,255,255,0.06)': '#e2e8f0', // Grid lines
  'rgba(255, 255, 255, 0.3)': '#64748b', // Text labels
  'rgba(255,255,255,0.3)': '#64748b', // Text labels
  'rgba(255, 255, 255, 0.4)': '#64748b', // Text labels
  'rgba(255,255,255,0.4)': '#64748b', // Text labels
  'rgba(255, 255, 255, 0.5)': '#64748b', // Text labels
  'rgba(255,255,255,0.5)': '#64748b', // Text labels
  '#fff': '#475569',
  'white': '#475569',
  '#ffffff': '#475569'
};

walk('C:/Users/Mete/Desktop/InsaatERP/src', function(filePath) {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace neon colors with pastel colors globally
    for (const [oldColor, newColor] of Object.entries(colorMap)) {
      // Create a global regex for each, avoiding replacing CSS variables that might have been added
      // We will carefully replace stroke="..." and fill="..."
      
      const regexStroke = new RegExp(`stroke=['"]${oldColor.replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\s+/g, '\\s*')}['"]`, 'gi');
      content = content.replace(regexStroke, `stroke="${newColor}"`);
      
      const regexFill = new RegExp(`fill=['"]${oldColor.replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\s+/g, '\\s*')}['"]`, 'gi');
      content = content.replace(regexFill, `fill="${newColor}"`);
      
      const regexStopColor = new RegExp(`stopColor=['"]${oldColor.replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\s+/g, '\\s*')}['"]`, 'gi');
      content = content.replace(regexStopColor, `stopColor="${newColor}"`);
    }

    // Explicitly target Recharts Axis lines
    content = content.replace(/tick={{ fill: ['"]rgba?\(255, ?255, ?255, ?0\.\d+['"] }}/g, "tick={{ fill: '#64748b' }}");
    content = content.replace(/tick={{ fill: ['"]white['"] }}/g, "tick={{ fill: '#64748b' }}");
    
    // Explicit tooltip styling if they exist (background color)
    content = content.replace(/contentStyle={{[^}]*background:\s*['"]rgba\(10, ?13, ?24, ?0\.\d+\)['"][^}]*}}/g, "contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, color: '#0f172a' }}");
    content = content.replace(/contentStyle={{[^}]*background:\s*['"]#080b14['"][^}]*}}/g, "contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, color: '#0f172a' }}");

    // Replace Recharts line/bar neon hex colors specifically where missed
    content = content.replace(/"#00D4FF"/gi, '"#3b82f6"');
    content = content.replace(/"#7B2FFF"/gi, '"#818cf8"');
    content = content.replace(/"#FF6B35"/gi, '"#fb923c"');
    content = content.replace(/"#00FFB3"/gi, '"#34d399"');
    content = content.replace(/"#FFD93D"/gi, '"#fbbf24"');
    content = content.replace(/"#FF4D6D"/gi, '"#f87171"');
    
    content = content.replace(/'#00D4FF'/gi, "'#3b82f6'");
    content = content.replace(/'#7B2FFF'/gi, "'#818cf8'");
    content = content.replace(/'#FF6B35'/gi, "'#fb923c'");
    content = content.replace(/'#00FFB3'/gi, "'#34d399'");
    content = content.replace(/'#FFD93D'/gi, "'#fbbf24'");
    content = content.replace(/'#FF4D6D'/gi, "'#f87171'");

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated charts/colors in ${filePath}`);
    }
  }
});
