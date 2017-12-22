import {Message} from './message'

class PitchBend extends Message {
	static predicate(data) {
		return (data[0] >> 4 & 0b0111) === 6
	}

	constructor(data, timeStamp, input) {
		super(data, timeStamp, input)
		this.type = 'Pitch Bend'
		this.value = data[2] * 128 + data[1]
	}
}

Message.register(PitchBend)