const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controller');

/* const corsOptions = {
    origin: 'http://example.com',
    optionsSuccessStatus: 200
}
 */
class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);
        this.connectDB();
        this.middlewares();
        this.routes();
        this.sockets();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {
        //ACCESOS CORS
        this.app.use(cors());
        //LECTURA BODY
        this.app.use(express.json());
        //DIRECTORIO
        this.app.use(express.static('public'));
        //FILES
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use('/api/auth', require('../routes/auth'));
        this.app.use('/api/search', require('../routes/buscar'));
        this.app.use('/api/categories', require('../routes/category'));
        this.app.use('/api/products', require('../routes/product'));
        this.app.use('/api/uploads', require('../routes/uploads'));
        this.app.use('/api/users', require('../routes/user'));
    }

    sockets() {
        this.io.on('connection', (socket) => socketController(socket, this.io));
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`El webserver esta corriendo en el puerto ${this.port}`);
        });
    }
}

module.exports = Server;
