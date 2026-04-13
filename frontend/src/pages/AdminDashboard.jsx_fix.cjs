const fs = require('fs');
const path = 'c:\\Users\\girid\\Downloads\\MLXDIRECT\\frontend\\src\\pages\\AdminDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

// Line 557 is index 556
// lines[556] is </div>
// lines[557] is <td ...>
// We need to insert </td> between them.

if (lines[557].trim() === '<td className="px-8 py-5 text-center">') {
    lines.splice(557, 0, '                          </td>');
    fs.writeFileSync(path, lines.join('\n'));
    console.log('Fixed syntax error at line 557');
} else {
    console.log('Target line not matched. Actual content:', lines[557]);
}
