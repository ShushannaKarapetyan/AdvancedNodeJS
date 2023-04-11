import {createServer} from 'http';
import fs from 'fs';
import path from 'path';

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript'
}

function fileMiddleware(req, res, next) {
    let url = req.url;

    if (url === '/') {
        url = '/index.html';
    }

    const filePath = path.resolve('public' + url)

    fs.promises.access(filePath)
        .then(() => {
            const ext = path.extname(filePath);
            res.writeHead(200, {'Content-Type': mimeTypes[ext]});
            fs.createReadStream(filePath).pipe(res);
        })
        .catch(() => {
            next();
        });
}

const server = createServer((req, res) => {
    fileMiddleware(req, res, () => {
        if (req.url === '/hello') {
            res.writeHead(200, {'Content-type': 'text/plain'});
            res.end('Hello World!')
        } else if (req.url === '/bye') {
            res.writeHead(200, {'Content-type': 'application/json'});
            res.end(JSON.stringify({
                name: "Your name"
            }))
        } else {
            res.writeHead(404, {'Content-type': 'text/plain'});
            res.end('Not found.')
        }
    })
});

server.listen(3000);
