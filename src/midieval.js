import { MidiEvalMessage } from './events/midieval-message'
import { Note } from './events/note'

function iterableToObservable(iterable) {
	return Rx.Observable.generate(
		iterable.next(),
		(item) => !item.done,
		() => iterable.next(),
		(item) => item.value
	)
}

function iterableToArray(iterable) {
	const arr = []
	iterable.forEach((output) => arr.push(output))
	return arr
}

const distinct = function(selector) {
	const set = new Set()
	return function(item) {
		return set.has(selector(item)) ? false : !!set.add(selector(item))
	}
}
module.exports = function midieval() {
	const midi$ = Rx.Observable.fromPromise(navigator.requestMIDIAccess())
	// Output
	const originalOutputs$ = midi$
		.pluck('outputs')
		.map(iterableToArray)

	const outputs$ = midi$
		.flatMap((midi) => Rx.Observable.fromEvent(midi, 'statechange'))
		.filter(({port}) => port.type === 'output')
		.pluck('target', 'outputs')
		.map(iterableToArray)
		.merge(originalOutputs$)

	outputs$.subscribe((outputs) => midieval.outputs = outputs)

	// Input
	const originalInput$ = midi$
	  .map(({inputs}) => inputs.values())
	  .flatMap(iterableToObservable)

	const newConnection$ = midi$
		.flatMap((midi) => Rx.Observable.fromEvent(midi, 'statechange', ({port}) => port))
		.filter(({state}) => state === 'connected')

	const input$ = newConnection$
		.filter((port) => port.type === 'input')
		.merge(originalInput$)
		.filter(distinct(({id}) => id))

	const message$ = input$
		.flatMap((input) => Rx.Observable.fromEvent(input, 'midimessage'))
		.map(({data, timeStamp}) => MidiEvalMessage.create(data, timeStamp))


	return message$
}