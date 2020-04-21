import crypto from 'crypto';
import cryptoRandom from 'crypto-random-string';

interface RSAKeyPair {
    public: string;
    private: string;
}

class Crypto {

    static randomKey(length: number): string {
        return cryptoRandom({length, type: 'base64'})
    }

    static encodeBase64(query: string): string {
        const buffer: Buffer = Buffer.from(query);
        return buffer.toString('base64');
    }

    static decodeBase64(query: string | Buffer): string {
        let buffer = query;
        if(typeof query === 'string') buffer = Buffer.from(query, 'base64');
        return buffer.toString('utf8');
    }

    static async generateRSA(): Promise<RSAKeyPair> {
        return new Promise<RSAKeyPair>((resolve) => {
            crypto.generateKeyPair('rsa', {
                modulusLength: 4096,
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

}

export default Crypto;