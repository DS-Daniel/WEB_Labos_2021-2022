export default class Codec {
    constructor(types) {
        this.types = types;
    }

    decode(string) {
        const message = JSON.parse(string);
        if (message.object instanceof Object) {
            message.object = Object.assign(new this.types[message.type](), message.object);
        }
        return message;
    }

    encode(message) {
        return JSON.stringify(message);
    }
}
