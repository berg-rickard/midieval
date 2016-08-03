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

function distinct(selector) {
	const set = new Set()
	return function(item) {
		return set.has(selector(item)) ? false : !!set.add(selector(item))
	}
}
let message$
module.exports = function midieval() {
	if (message$) { return message$ }
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

	midieval.output = Rx.Subject.create()
	midieval.output
		.withLatestFrom(outputs$)
		.subscribe(([message, outputs]) => {
			if (message.message && message.selector instanceof Function) {
				outputs = outputs
					.filter(message.selector)
				message = message.message
			}
			outputs.forEach((output) => output.send(message._data, message.timeStamp))
		})

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

	message$ = input$
		.flatMap((input) => Rx.Observable.fromEvent(input, 'midimessage'))
		.map(({data, timeStamp}) => MidiEvalMessage.create(data, timeStamp))


	return message$
}