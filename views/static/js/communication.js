class Communication {

    static sendMessage(location, data) {
        if(typeof data === 'object') data = JSON.stringify(data);

    }

}