import * as path from 'path';
import {Request, Response} from 'express';

export default class Home {

    public static index(req: Request, res: Response) {
        return res.render('pages/home', {
            basedir: path.join(__dirname, '../../')
        });
    }

}