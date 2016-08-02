class MidiEvalMessage {
	static register(klass) {
		MidiEvalMessage.classes.push(klass)
	}
	static create(data, timeStamp) {
		const klass = MidiEvalMessage.classes.filter((klass) => klass.predicate(data))[0]
		return klass ? new klass(data, timeStamp) : new MidiEvalMessage(data, timeStamp)
	}

	constructor(data, timeStamp) {
		this._data = data
		this.timeStamp = timeStamp
	}
}
MidiEvalMessage.classes = []



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

class Note extends MidiEvalMessage {
	static predicate(data) {
		return (data[0] >> 4 & 0b0111) < 3
	}
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

	get channel() {
		return this._data[0] & 0b1111 + 1
	}

	get velocity() {
		return this._data[2]
	}
}
MidiEvalMessage.register(Note)


function iterableToObservable(iterable) {
	return Rx.Observable.generate(
		iterable.next(),
		(item) => !item.done,
		() => iterable.next(),
		(item) => item.value
	)
}

const distinct = function(selector) {
	const set = new Set()
	return function(item) {
		return set.has(selector(item)) ? false : !!set.add(selector(item))
	}
}
function midieval() {
	const midi$ = Rx.Observable.fromPromise(navigator.requestMIDIAccess())

	const originalInput$ = midi$
	  .map(({inputs}) => inputs.values())
	  .flatMap(iterableToObservable)

	const originalOutput$ = midi$
	  .map(({outputs}) => outputs.values())
	  .flatMap(iterableToObservable)


	const newConnection$ = midi$
		.flatMap((midi) => Rx.Observable.fromEvent(midi, 'statechange', ({port}) => port))
		.filter(({state}) => state === 'connected')

	const newInput$ = newConnection$
		.filter((port) => port.type === 'input')


	const input$ = originalInput$
		.merge(newInput$)
		.filter(distinct(({id}) => id))

	const message$ = input$
		.flatMap((input) => Rx.Observable.fromEvent(input, 'midimessage'))
		.map(({data, timeStamp}) => MidiEvalMessage.create(data, timeStamp))

	return message$
}

midieval()
	.filter(({type}) => type === 'Note On')
	.subscribe((message) => console.log(`${message.note} ${message.velocity}`))
