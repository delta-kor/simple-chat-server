import mongoose from '../providers/Database';
import {Document, Schema} from 'mongoose';
import Crypto from '../providers/Crypto';

const UserSchema: Schema = new mongoose.Schema({
    nickname: { type: String, required: true, unique: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: false }
}, { timestamps: true });

UserSchema.pre('save', async function(call) {
    const user = this;
    if(!user.isModified('password'))
        return call();
    user['password'] = await Crypto.hash(user['password']);
    return call();
});

const User = mongoose.model('User', UserSchema);

class UserManager {

    static async checkValid(user: Document) {
         const checkResult: any[] = await new Promise((resolve, reject) => {
            User.find({ email : user['email'] }, (error, result) => {
                if(error) {
                    reject(error);
                    return false;
                }
                resolve(result);
            });
         });
         if(checkResult.length > 0) {
             return {
                 valid: false,
                 type: 1
             }
         }
         return { valid: true };
    }

}

export default User;
export {UserManager};