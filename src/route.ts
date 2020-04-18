import {Application} from 'express';

import webRouter from './routes/Web';
import apiRouter from './routes/Api';

class Route {

    static mountWeb(express: Application): Application {
        return express.use('/', webRouter);
    }

    static mountApi(express: Application): Application {
        const apiPrefix = process.env.APIPREFIX;
        return express.use(`/${apiPrefix}`, apiRouter);
    }

    static mount(express: Application): Application {
        express = this.mountWeb(express);
        express = this.mountApi(express);
        return express;
    }

}

export default Route;