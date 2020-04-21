import Crypto, {RSAKeyPair} from './crypto';
import Security from './security';

interface ServerHelloResponse {
    accessKey: string;
    public: string;
}

class Auth {

    static async serverHello(): Promise<ServerHelloResponse> {
        const keySet = await Crypto.generateRSA();
        const accessKey = Crypto.randomKey(10);
        Security.storeKey(accessKey, keySet);
        const encodedPublic = Crypto.encodeBase64(keySet.public);
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