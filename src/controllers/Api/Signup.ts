import {Request, Response} from 'express';
import Auth, {EncryptedPayload} from '../../providers/Auth';
import User, {UserManager} from '../../models/User';
import * as EmailValidator from 'email-validator';
import Security from '../../providers/Security';

interface SignupPayload {
    nickname: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export default class Signup {

    public static async signup(req: Request, res: Response) {
        const payload: EncryptedPayload = req.body;
        const accessKey: string = req.cookies.dx_access_key;
        if(!payload.key || !payload.data || !accessKey) {
            res.json({
                resolved: false,
                status: 1,
                message: 'invalid payload or access key'
            });
            return false;
        }
        const result: string | null = Auth.serverData(payload.key, payload.data, accessKey);
        if(!result) {
            res.json({
                resolved: false,
                status: 2,
                message: 'access key expired'
            });
            return false;
        }
        function exitPrompt(title: string, content: string) {
            res.json({
                resolved: true,
                status: 4,
                data: {
                    title, content
                }
            })
        }
        let data: SignupPayload;
        try {
            data = JSON.parse(result);
            if(!data.nickname) {
                exitPrompt('Enter Nickname', null);
                return false;
            }
            if(!data.email) {
                exitPrompt('Enter Email', null);
                return false;
            }
            if(!data.password) {
                exitPrompt('Enter Password', null);
                return false;
            }
            if(data.password !== data.confirmPassword) {
                exitPrompt('Password Does Not Match', 'Please check it again.');
                return false;
            }
            if(data.nickname.length < 5) {
                exitPrompt('Nickname Too Short', 'Nickname must be at least 5 letters');
                return false;
            }
            if(!EmailValidator.validate(data.email)) {
                exitPrompt('Invalid Email', 'Try another email');
                return false;
            }
            if(data.password.length < 8) {
                exitPrompt('Password Too Short', 'Password must be at least 8 letters');
                return false;
            }
        } catch(e) {
            console.log(e);
            res.json({
                resolved: false,
                status: 3,
                message: 'failed to parse json'
            });
            return false;
        }

        const user = new User({
            nickname: data.nickname,
            email: data.email,
            password: data.password
        });
        const isValid = await (UserManager.checkValid(user));
        if(!isValid.valid) {
            switch (isValid.type) {
                case 1:
                    exitPrompt('Existing Email', 'Try another email');
                    return false;
                default:
                    exitPrompt('Unexpected Error', 'Try again later');
                    return false;
            }
        }
        await user.save();
        Security.deleteKey(accessKey);
        res.json({
            resolved: true,
            status: 0
        });
    }

}