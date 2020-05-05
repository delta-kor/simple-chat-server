import * as path from 'path';
import {Request, Response} from 'express';
import Auth, {ServerHelloResponse} from '../providers/auth';

export default class Home {

    public static index(req: Request, res: Response) {
        return res.render('pages/home', {
            basedir: path.join(__dirname, '../../')
        });
    }

    public static async signup(req: Request, res: Response) {
        const accessKey: string = req.cookies['dx_access_key'];
        const payload: ServerHelloResponse = await Auth.serverHello(accessKey);
        res.cookie('dx_access_key', payload.accessKey);
        return res.render('pages/signup', {
            basedir: path.join(__dirname, '../../'),
            data: {
                publicKey: payload.public
            }
        });
    }

}