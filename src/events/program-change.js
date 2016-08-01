import {MidiEvalMessage} from './midieval-message'

export class ProgramChange extends MidiEvalMessage {
	get type() {
		return 'Program Change'
	}

	get value() {
		return this._data[1]
	}
}