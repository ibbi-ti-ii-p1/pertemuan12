const http = require('http');
const url = require('url');

const products = [
    {
        id: 1, name: 'Shampo', price: 30000
    },
    {
        id: 2, name: 'Sikat Gigi', price: 12000
    },
    {
        id: 3, name: 'Snack', price: 10000
    }
];

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });

    if(parsedUrl.pathname === '/products') {
        if (req.method === 'GET') {
            res.end(JSON.stringify({
                "products": products
            }));
        } else if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });

            req.on('end', () => {
                const product = JSON.parse(body);
                product.id = products.length + 1;
                products.push(product);
                res.end(JSON.stringify({
                    "product": product
                }));
            });
        } else {
            res.end('Method not allowed');
        }
    }
});

server.listen(3030, () => {
    console.log('Server sedang dijalankan di port 3030');
});
// http://localhost:3030/products
// http://127.0.0.1:3030