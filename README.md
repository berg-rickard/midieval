# midieval

A small helper to simplify working with [Web MIDI API](https://developer.mozilla.org/en-US/docs/tag/Web%20MIDI%20API). After initiated, it listens to all connected MIDI devices and wraps the received MIDI messages in a more human readable format.

So far it only supports listening to MIDI messages (not sending) and is used in the following manner:

```js
midieval.in(function(msg) {
	if (msg.type === 'Unknown') { return; }
	console.log(msg)

});
```

which should generate something like:

```js
Note {
	channel: 1,
	device: { id: "-123456789", name: "Yamaha" },
	note: "G",
	octave: -1,
	timestamp: 20162.53555006,
	type: "Note On",
	velocity: 69,
	_data: Uint8Array(3) [144, 55, 69]
}
```

or:

```js
ControlChange {
	channel: 1,
	controller: "Sustain"
	device: { id: "-123456789", name: "Yamaha" },
	timestamp: 20242.53555006,
	type: "Control Change",
	value: 55,
	_data: Uint8Array(3) [176, 64, 55]
}
```

Currently supported message wrappers are:
- Note On
- Note Off
- Control Change
- Pitch Bend
- Aftertouch
- Channel Pressure
- Program Change

If no matching message wrapper is found, it gives you a default `Message` with type `Unknown`, with MIDI data, timeStamp and device.