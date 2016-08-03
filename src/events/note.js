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

function clamp(val, min, max) {
	return Math.max(
		min,
		Math.min(
			max,
			val
		)
	)
}

export class Note extends MidiEvalMessage {
	static predicate(data) {
		return (data[0] >> 4 & 0b0111) < 3
	}
	get type() {
		const typeIndex = this._data[0] >> 4 & 0b0111
		return TYPE_MAP[typeIndex]
	}

	set type(type) {
		const index = TYPE_MAP.indexOf(type)
		if (index !== -1) {
			this._data[0] = (this._data[0] & 0b10001111) + (index << 4)
		}
	}

	get note() {
		const noteIndex = this._data[1] % 12
		return NOTE_MAP[noteIndex]
	}

	set note(note) {
		const index = NOTE_MAP.indexOf(note)
		if (index !== -1) {
			const currentIndex = this._data[1] % 12
			let newIndex = this._data[1] + index - currentIndex
			if (newIndex < 0) { newIndex += 12 }
			else if (newIndex > 127) { newIndex -= 12 }
			this._data[1] = newIndex
		}
	}

	get octave() {
		return Math.floor(this._data[1] / 12 - 5)
	}

	set octave(octave) {
		if (octave >= -5 && octave <= 5) {
			this._data[1] += (octave - this.octave) * 12
		}
	}

	get channel() {
		return (this._data[0] & 0b1111) + 1
	}

	set channel(channel) {
		if (channel > 0 && channel <= 16) {
			this._data[0] = (this._data[0] & 0b11110000) + (channel - 1)
		}
	}

	get velocity() {
		return this._data[2]
	}

	set velocity(velocity) {
		this._data[2] = clamp(velocity, 0, 127)
	}
}

MidiEvalMessage.register(Note)