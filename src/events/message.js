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
		this.timeStamp = timeStamp
		this.type = 'Unknown'
		this.device = {
			id: input.id,
			name: input.name,
		}
	}
}
