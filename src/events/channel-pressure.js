import {Message, ChannelMessage} from './message'

export class ChannelPressure extends ChannelMessage {
	static predicate(data) {
		return (data[0] >> 4 & 0b0111) === 5
	}

	constructor(data, timeStamp, input) {
		super(data, timeStamp, input)
		this.type = 'Channel Pressure'
		this.value = data[1]
	}
}

Message.register(ChannelPressure)