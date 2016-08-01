import {MidiEvalMessage} from './midieval-message'


const TYPE_MAP = [
	'Note Off',
	'Note On',
	'Aftertouch'
]

const NOTE_MAP = [
	'C',
	'C#',
	'D',
	'Eb',
	'E',
	'F',
	'F#',
	'G',
	'Ab',
	'A',
	'Bb',
	'B'
]

export class Note extends MidiEvalMessage {
	get type() {
		const typeIndex = this._data[0] >> 4 & 0b0111
		return TYPE_MAP[typeIndex]
	}

	get note() {
		const noteIndex = this._data[1] % 12
		return NOTE_MAP[noteIndex]
	}

	get octave() {
		return Math.floor(this._data[1] / 12 - 5)
	}
}