import {Message} from './message'

export class ProgramChange extends Message {
	static predicate(data) {
		return (data[0] >> 4 & 0b0111) === 4
	}

	constructor(data, timeStamp, input) {
		super(data, timeStamp, input)
		this.type = 'Program Change'
		this.value = data[1]
	}
}

Message.register(ProgramChange)