class MidiEvalMessage {
	static register(klass) {
		MidiEvalMessage.classes.push(klass)
	}
	static create(data, timeStamp) {
		const klass = MidiEval.classes.filter((klass) => klass.predicate(data))[0]
		return klass ? new klass(data, timeStamp) : new MidiEvalMessage(data, timeStamp)
	}

	get type() {
		return 'Unknown'
	}
	constructor(data, timeStamp) {
		this._data = data
		this.timeStamp = timeStamp
	}
}

MidiEvalMessage.classes = []

export MidiEvalMessage