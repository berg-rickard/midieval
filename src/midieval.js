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

const distinct = function(selector) {
	const set = new Set()
	return function(item) {
		return set.has(selector(item)) ? false : !!set.add(selector(item))
	}
}
module.exports = function midieval() {
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