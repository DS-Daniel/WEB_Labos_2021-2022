export default class Replica extends Map {
    constructor() {
        super();
        this.start = new Date().getTime();
        this.playerId = undefined;
    }

    /**
     * Compute the current game timestamp.
     */
    timestamp() {
        return new Date().getTime() - this.start;
    }

    onMessage(message) {
        switch (message.action) {
            case 'join':
                this.start = new Date().getTime() - message.object;
                break;
            case 'id':
                console.log("NEW ID : " + message.object)
                this.playerId = message.object;
                break;
            case 'set':
                this.set(message.object.id, message.object);
                break;
            case 'delete':
                this.delete(message.object);
                break;
            default:
                break;
        }
    }

    move() {
        const timestamp = this.timestamp();
        for (const entity of this.values()) {
            while (entity.timestamp < timestamp) entity.move();
        }
    }
}
