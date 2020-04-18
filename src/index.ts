import * as express from 'express';
import * as bodyParser from 'body-parser';

class Server {

    public application: express.Application;

    constructor() {
        this.application = express();
    }

    start(port: number = 3000, onStart?: () => void): Server {
        console.info('Starting Server...');
        this.application.listen(port, onStart);
        return this;
    }

    mountMiddleware(): Server {
        console.info('Mounting Middleware...');
        this.application.use(bodyParser.json());
        this.application.use(bodyParser.urlencoded({ extended: true }));
        return this;
    }

}

const server = new Server();
server.mountMiddleware();
server.start(3000, () => console.log('App listening on port 3000. Good Luck!'));