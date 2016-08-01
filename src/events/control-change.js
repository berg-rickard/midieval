import {MidiEvalMessage} from './midieval-message'

const CONTROLLER_MAP = {
	1: 'Modulation',
	7: 'Volume',
	10: 'Pan',
	11: 'Expression',
	64: 'Sustain'
}

export class ControlChange extends MidiEvalMessage {
	get type() {
		return 'Control Change'
	}
	get controller() {
		return CONTROLLER_MAP[this._data[1]] || this._data[1]
	}

	get value() {
		return this._data[2]
	}
}