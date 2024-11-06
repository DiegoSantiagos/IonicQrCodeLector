const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('bd.json');
const middlewares = jsonServer.defaults();

// Configurar CORS
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

server.use(middlewares);
server.use(router);
server.listen(3000, () => {
    console.log('JSON Server is running on port 3000');
});