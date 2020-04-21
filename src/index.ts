import * as dotenv from 'dotenv';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import Route from './providers/route';
import {Database} from './providers/database';

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

    loadDatabase(): Server {
        console.log('Loading Database...');
        Database.init();
        return this;
    }

    mountMiddleware(): Server {
        console.log('Mounting Middleware...');

        this.application.set('view engine', 'pug');
        this.application.use(bodyParser.json());
        this.application.use(bodyParser.urlencoded({ extended: true }));
        return this;
    }

    mountRoutes(): Server {
        this.application = Route.mount(this.application);
        return this;
    }

}

const server = new Server();
server.loadConfiguration();
server.loadDatabase();
server.mountMiddleware();
server.mountRoutes();

const port = parseInt(process.env.PORT);
server.start(port, () => console.log(`App listening on port ${port}. Good Luck!`));