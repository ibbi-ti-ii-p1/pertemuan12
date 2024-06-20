const http = require('http');
const url = require('url');

const sqlite = require("sqlite3").verbose();

const products = [];

const db = new sqlite.Database("./products.sqlite", (err) => {
    if (err) {
        console.error("Error opening database " + err.message);
    } else {
        db.run(`CREATE TABLE IF NOT EXISTS 
                products(
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    price INTEGER)`, (err) => {
                if (err) {
                    console.error("Error creating table " + err.message);
                }
                console.log("Table created");
            });
    }
});


const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
    });

    if (parsedUrl.pathname === '/products') {
        if (req.method === 'GET') {
            db.all("SELECT * FROM products", (err, rows) => {
                if (err) {
                    console.error("Error getting products " + err.message);
                    res.end(JSON.stringify({
                        "error": err.message
                    }));
                } else {
                    res.end(JSON.stringify({
                        "products": rows
                    }));
                }
            });
            /* res.end(JSON.stringify({
                "products": products
            })); */
        } else if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
                // body = body + chunck;
            });

            req.on('end', () => {
                const product = JSON.parse(body);
                product.id = products.length + 1;
                // products.push(product);
                db.run(`INSERT INTO products 
                        (name, price)
                        VALUES (?, ?)`, [product.name, product.price], (err) => {
                    if (err) {
                        console.error("Error inserting product " + err.message);
                        res.end(JSON.stringify({
                            "error": err.message
                        }));
                    } else {
                        db.all("SELECT * FROM products", (err, rows) => {
                            if (err) {
                                console.error("Error getting products " + err.message);
                                res.end(JSON.stringify({
                                    "error": err.message
                                }));
                            } else {
                                res.end(JSON.stringify({
                                    "products": rows
                                }));
                            }
                        });
                    }
                });
                /* res.end(JSON.stringify({
                    "product": product
                })); */
            });
        } else if(req.method === 'DELETE') {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });

            req.on('end', () => {
                const product = JSON.parse(body);
                const id = product.id;
                
                db.run("DELETE FROM products WHERE id = ?", [id], (err) => {
                    if (err) {
                        console.error("Error deleting product " + err.message);
                        res.end(JSON.stringify({
                            "error": err.message
                        }));
                    } else {
                        db.all("SELECT * FROM products", (err, rows) => {
                            if (err) {
                                console.error("Error getting products " + err.message);
                                res.end(JSON.stringify({
                                    "error": err.message
                                }));
                            } else {
                                res.end(JSON.stringify({
                                    "products": rows
                                }));
                            }
                        });
                    }
                });
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