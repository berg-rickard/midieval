import { Message } from './events/message'
import { Note } from './events/note'

const midieval = {
	Message: Message,
	Note: Note,
	in: function (callback) {
		navigator.requestMIDIAccess().then((midi) => {
			function listener(evt, input) {
				const message = Message.create(evt.data, evt.timeStamp, input)
				callback(message)
			}

			const inputs = [];
			for (const input of midi.inputs.values()) {
				inputs.push(input)
				input.addEventListener('midimessage', (evt) => listener(evt, input))
			}

			midi.addEventListener('statechange', ({port}) => {
				if (port.state !== 'connected' || port.type !== 'input') { return }
				if (inputs.some((input) => input.id === port.id)) { return }
				port.addEventListener('midimessage', (evt) => listener(evt, port))
				inputs.push(port)
			})
		})
	},
}

module.exports = midieval