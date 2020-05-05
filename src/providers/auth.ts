import Crypto, {RSAKeyPair} from './crypto';
import Security, {StoreKey} from './security';

export interface ServerHelloResponse {
    accessKey: string;
    public: string;
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
        const accessKey: string = Crypto.randomKey(10);
        Security.storeKey(accessKey, keySet);
        const encodedPublic: string = Crypto.encodeBase64(keySet.public);
        return {
            accessKey, public: encodedPublic
        };
    }

    static serverData(encrypted: string, accessKey: string): string {
        const keySet: RSAKeyPair = Security.getKey(accessKey).value;
        return Crypto.decryptRSA(keySet.private, encrypted);
    }

}

export default Auth;