import {MidiEvalMessage} from './midieval-message'

export class ChannelPressure extends MidiEvalMessage {
	get type() {
		return 'Channel Pressure'
	}

	get value() {
		return this._data[1]
	}
}