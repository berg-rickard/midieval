import {Message} from './message'

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

export class Note extends Message {
	static predicate(data) {
		return (data[0] >> 4 & 0b0111) < 3
	}

	constructor(data, timeStamp, input) {
		super(data, timeStamp, input)

		this.type = TYPE_MAP[data[0] >> 4 & 0b0111]
		this.note = NOTE_MAP[this._data[1] % 12]

		this.octave = Math.floor(data[1] / 12 - 5)
		this.channel = (data[0] & 0b1111) + 1
		this.velocity = data[2]
	}
}

Message.register(Note)