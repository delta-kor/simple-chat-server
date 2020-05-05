import {Request, Response} from 'express';
import Auth, {EncryptedPayload} from '../providers/Auth';

export default class Signup {

    public static signup(req: Request, res: Response) {
        const payload: EncryptedPayload = req.body;
        if(!payload.key || !payload.data || !req.cookies.dx_access_key) {
            res.json({
                resolved: false,
                status: 401,
                message: 'invalid payload or access key'
            });
            return false;
        }
        const result = Auth.serverData(payload.key, payload.data, req.cookies.dx_access_key);
        if(!result) {
            res.json({
                resolved: false,
                status: 406,
                message: 'access key expired'
            });
            return false;
        }
        console.log(result);
        res.json({
            resolved: true,
            status: 200
        })
    }

}