class Message {
	constructor(action, object) {
		this.action = action;
		this.type = object.constructor.name;
		this.object = object;
	}
}

class Codec {
	constructor(types) {
		this.types = types;
	}

	decode(message) {
		// Deserialize the message
		message = JSON.parse(message);
		if (message.type === 'Vehicle' || message.type === 'Rocket') {
			message.object = Object.assign(
				new this.types[message.type](),
				message.object
			);
		}
		return message;
	}

	encode(message) {
		// Serialize the message
		return JSON.stringify(message);
	}
}

export { Message, Codec };
