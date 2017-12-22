export class Message {
	static classes = []
	static register(messageClass) {
		Message.classes.push(messageClass)
	}

	static create(data, timeStamp, input) {
		const messageClass = Message.classes.find((messageClass) => messageClass.predicate(data))
		return messageClass ? new messageClass(data, timeStamp, input) : new Message(data, timeStamp, input)
	}

	constructor(data, timeStamp, input) {
		this._data = data
		this.type = 'Unknown'

		this.timeStamp = timeStamp
		this.device = {
			id: input.id,
			name: input.name,
		}
	}
}

export class ChannelMessage extends Message {
	constructor(data, timeStamp, input) {
		super(data, timeStamp, input)
		this.channel = (data[0] & 0b1111) + 1
	}
}