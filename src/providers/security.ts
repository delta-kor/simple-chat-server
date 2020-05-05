interface StoreKey {
    key: string;
    value: any;
    expiredAfter: Date | null;
}

class Security {

    private keyStore: StoreKey[];

    constructor() {
        this.keyStore = [];
    }

    storeKey(publicKey: string, privateValue: any, lifeMin: number | Date = 60): Security {
        this.refreshExpired();
        let lifeMilliSeconds: number;
        if(lifeMin instanceof Date)
            lifeMilliSeconds = lifeMin.getTime();
        else
            lifeMilliSeconds = lifeMin * 60 * 1000;
        const nowTime: number = new Date().getTime();
        const expiredAfter = new Date(nowTime + lifeMilliSeconds);
        this.keyStore.push({
            key: publicKey, value: privateValue, expiredAfter
        });
        return this;
    }

    getKey(publicKey: string): StoreKey | null {
        this.refreshExpired();
        for(let key of this.keyStore)
            if (key.key === publicKey) return key;
        return null;
    }

    deleteKey(publicKey: string): Security {
        let index: number = 0;
        for(let key of this.keyStore) {
            if(key.key === publicKey)
                delete this.keyStore[index];
            index++;
        }
        return this;
    }

    refreshExpired(): Security {
        let index: number = 0;
        const nowTime: number = new Date().getTime();
        for(let key of this.keyStore) {
            if(key.expiredAfter.getTime() < nowTime)
                this.keyStore.splice(index, 1);
            index++;
        }
        return this;
    }

}

export default new Security();
export {StoreKey};