import {MidiEvalMessage} from './midieval-message'

class PitchBend extends MidiEvalMessage {
	get type() {
		return 'Pitch Bend'
	}

	get value() {
		this._data[2] * 128 + this._data[1]
	}

}