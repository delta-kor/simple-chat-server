import * as crypto from 'crypto';
import * as cryptoRandom from 'crypto-random-string';

interface RSAKeyPair {
    public: string;
    private: string;
}

class Crypto {

    static randomKey(length: number): string {
        return cryptoRandom({length, type: 'hex'})
    }

    static encodeBase64(query: string): string {
        const buffer: Buffer = Buffer.from(query);
        return buffer.toString('base64');
    }

    static decodeBase64(query: string | Buffer, returnBuffer: boolean = false): string | Buffer {
        let buffer = query;
        if(typeof query === 'string') buffer = Buffer.from(query, 'base64');
        return returnBuffer ? buffer : buffer.toString('utf8');
    }

    static async hash(query: string, salt?: string): Promise<string> {
        if(salt)
            return new Promise<string>((resolve, reject) => {
                crypto.scrypt(query, salt, 128, (error, key) => {
                    if(error) {
                        reject(error);
                        return false;
                    }
                    resolve(key.toString('hex'));
                });
            });
        return new Promise<string>((resolve, reject) => {
            resolve(crypto.createHash('sha512').update(query).digest('hex'));
        });
    }

    static async generateRSA(): Promise<RSAKeyPair> {
        return new Promise<RSAKeyPair>((resolve, reject) => {
            crypto.generateKeyPair('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem'
                }
            }, (error, publicKey, privateKey) => {
                if(error) {
                    reject(error);
                    return false;
                }
                const keyPair: RSAKeyPair = {public: publicKey, private: privateKey};
                resolve(keyPair);
            });
        });
    }

    static decryptRSA(privateKey: string, encodedEncrypted: string): string {
        const encrypted = this.decodeBase64(encodedEncrypted, true);
        if(!(encrypted instanceof Buffer)) return null;
        return crypto.privateDecrypt({
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_PADDING
        }, encrypted).toString('utf8');
    }

}

export default Crypto;
export {RSAKeyPair};