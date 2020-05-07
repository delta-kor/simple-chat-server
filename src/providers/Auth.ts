import Crypto, {RSAKeyPair} from './Crypto';
import Security, {StoreKey} from './Security';
import * as CryptoJS from 'crypto-js';

export interface ServerHelloResponse {
    accessKey: string;
    public: string;
}

export interface EncryptedPayload {
    key: string;
    data: string;
}

class Auth {

    static async serverHello(preAccessKey?: string): Promise<ServerHelloResponse> {
        if(preAccessKey) {
            const keyStore: StoreKey = Security.getKey(preAccessKey);
            if(keyStore) {
                return {
                    accessKey: preAccessKey,
                    public: Crypto.encodeBase64(keyStore.value.public)
                }
            }
        }
        const keySet: RSAKeyPair = await Crypto.generateRSA();
        const accessKey: string = Crypto.randomKey(32);
        Security.storeKey(accessKey, keySet);
        const encodedPublic: string = Crypto.encodeBase64(keySet.public);
        return {
            accessKey, public: encodedPublic
        };
    }

    static serverData(encryptedKey: string, encryptedData: string, accessKey: string): string | null {
        const accessKeyData: StoreKey | null = Security.getKey(accessKey);
        if(!accessKeyData) return null;
        const keySet: RSAKeyPair = accessKeyData.value;
        const cipher: string = Crypto.decryptRSA(keySet.private, encryptedKey);
        return CryptoJS.AES.decrypt(encryptedData, cipher).toString(CryptoJS.enc.Utf8);
    }

}

export default Auth;