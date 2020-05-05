class Communication {

    static async sendMessage(target, data) {
        if(typeof data === 'object') data = JSON.stringify(data);
        const encodedPublicKey = document.getElementById('dx_public_key').getAttribute('value');
        const publicKey = CryptoJS.enc.Base64.parse(encodedPublicKey).toString(CryptoJS.enc.Utf8);
        const cipherKey = CryptoJS.lib.WordArray.random(32).toString();
        const encrypter = new JSEncrypt();
        encrypter.setPublicKey(publicKey);
        const encryptedKey = encrypter.encrypt(cipherKey);
        const encryptedData = CryptoJS.AES.encrypt(data, cipherKey).toString();
        return await fetch(target, {
            method: 'POST',
            body: JSON.stringify({
                key: encryptedKey,
                data: encryptedData
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }

}