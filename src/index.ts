import * as dotenv from 'dotenv';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import Route from './providers/Route';
import {Database} from './providers/Database';

class Server {

    public application: express.Application;

    constructor() {
        this.application = express();
    }

    start(port: number = 3000, onStart?: () => void): Server {
        console.log('Starting Server...');
        this.application.listen(port, onStart);
        return this;
    }

    loadConfiguration(): Server {
        console.log('Loading Configuration...');
        dotenv.config();
        return this;
    }

    async loadDatabase(): Promise<Server> {
        console.log('Loading Database...');
        await Database.init();
        return this;
    }

    mountMiddleware(): Server {
        console.log('Mounting Middleware...');

        this.application.set('view engine', 'pug');
        this.application.use(bodyParser.json());
        this.application.use(bodyParser.urlencoded({ extended: true }));
        this.application.use(cookieParser());
        this.application.use(express.static('views/static'));
        return this;
    }

    mountRoutes(): Server {
        this.application = Route.mount(this.application);
        return this;
    }

}

const server = new Server();
(async () => {
    server.loadConfiguration();
    await server.loadDatabase();
    server.mountMiddleware();
    server.mountRoutes();

    const port = parseInt(process.env.PORT);
    server.start(port, () => console.log(`App listening on port ${port}. Good Luck!`));
})();