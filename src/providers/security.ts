interface Key {
    key: string;
    value: string;
    expiredAfter: Date;
}

class Security {

    private keyStore: Key[];

    constructor() {
        this.keyStore = [];
    }

    storeKey(publicKey: string, privateValue: string, lifeMin: number | Date = 10): Security {
        this.refreshExpired();
        let lifeMilliSeconds: number;
        if(lifeMin instanceof Date)
            lifeMilliSeconds = lifeMin.getTime();
        else
            lifeMilliSeconds = lifeMin * 60 * 1000;
        const nowTime = new Date().getTime();
        const expiredAfter = new Date(nowTime + lifeMilliSeconds);
        this.keyStore.push({
            key: publicKey, value: privateValue, expiredAfter
        });
        return this;
    }

    getKey(publicKey: string): Key | null {
        this.refreshExpired();
        for(let key of this.keyStore) {
            if (key.key === publicKey) return key;
        }
        return null;
    }

    refreshExpired(): Security {
        let index: number = 0;
        const nowTime: number = new Date().getTime();
        for(let key of this.keyStore) {
            if(key.expiredAfter.getTime() > nowTime) {
                delete this.keyStore[index];
            }
            index++;
        }
        return this;
    }

}

export default new Security();