const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5005;
const WEB_DIR = path.join(__dirname, 'build', 'web');

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
    let filePath = path.join(WEB_DIR, req.url === '/' ? 'index.html' : req.url);
    
    // Handle query strings
    if (filePath.includes('?')) {
        filePath = filePath.split('?')[0];
    }

    // Simple SPA routing: if file doesn't exist, serve index.html
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(WEB_DIR, 'index.html');
    }

    const extname = path.extname(filePath);
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(500);
            res.end(`Error: ${error.code}`);
        } else {
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Cache-Control': 'no-cache'
            });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Flutter Web server running at http://localhost:${PORT}`);
    console.log(`Serving files from: ${WEB_DIR}`);
});
