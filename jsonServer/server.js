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

server.use(jsonServer.bodyParser);

server.post('/asistencias', (req, res) => {
    const asistencia = req.body;
    asistencia.id = Date.now().toString();
    router.db.get('asistencias').push(asistencia).write();
    res.status(201).json(asistencia);
});

server.use(middlewares);
server.use(router);
server.listen(8000, () => {
    console.log('JSON Server is running on port 8000');
});