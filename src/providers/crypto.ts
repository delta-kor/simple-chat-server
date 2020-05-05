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

    static async generateRSA(): Promise<RSAKeyPair> {
        return new Promise<RSAKeyPair>((resolve) => {
            crypto.generateKeyPair('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem'
                }
            }, (err, publicKey, privateKey) => {
                const keyPair: RSAKeyPair = {public: publicKey, private: privateKey};
                resolve(keyPair);
            });
        });
    }

    static decryptRSA(privateKey: string, encodedEncrypted: string): string {
        const encrypted = this.decodeBase64(encodedEncrypted, true);
        if(!(encrypted instanceof Buffer)) return null;
        return crypto.privateDecrypt(privateKey, encrypted).toString('utf8');
    }

}

export default Crypto;
export {RSAKeyPair};