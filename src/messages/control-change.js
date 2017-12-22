import { Message, ChannelMessage } from './message'

const CONTROLLER_MAP = {
	0: 'Bank Select',
	1: 'Modulation',
	2: 'Breath Controller',
	4: 'Foot Controller',
	5: 'Portamento Time',
	6: 'Data Entry MSB',
	7: 'Volume',
	8: 'Balance',
	10: 'Pan',
	11: 'Expression Controller',
	12: 'Effect Control 1',
	13: 'Effect Control 2',
	16: 'General Purpose Controller 1',
	17: 'General Purpose Controller 2',
	18: 'General Purpose Controller 3',
	19: 'General Purpose Controller 4',

	32: 'LSB for Control 0 (Bank Select)',
	33: 'LSB for Control 1 (Modulation Wheel or Lever)',
	34: 'LSB for Control 2 (Breath Controller)',
	36: 'LSB for Control 4 (Foot Controller)',
	37: 'LSB for Control 5 (Portamento Time)',
	38: 'LSB for Control 6 (Data Entry)',
	39: 'LSB for Control 7 (Channel Volume, formerly Main Volume)',
	40: 'LSB for Control 8 (Balance)',
	42: 'LSB for Control 10 (Pan)',
	43: 'LSB for Control 11 (Expression Controller)',
	44: 'LSB for Control 12 (Effect control 1)',
	45: 'LSB for Control 13 (Effect control 2)',
	48: 'LSB for Control 16 (General Purpose Controller 1)',
	49: 'LSB for Control 17 (General Purpose Controller 2)',
	50: 'LSB for Control 18 (General Purpose Controller 3)',
	51: 'LSB for Control 19 (General Purpose Controller 4)',

	64: 'Sustain',
	65: 'Portamento',
	66: 'Sostenuto',
	67: 'Soft Pedal',
	68: 'Legato Footswitch',
	69: 'Hold 2',

	70: 'Sound Controller 1 (default: Sound Variation)',
	71: 'Sound Controller 2 (default: Timbre/Harmonic Intens.)',
	72: 'Sound Controller 3 (default: Release Time)',
	73: 'Sound Controller 4 (default: Attack Time)',
	74: 'Sound Controller 5 (default: Brightness)',
	75: 'Sound Controller 6 (default: Decay Time - see MMA RP-021)',
	76: 'Sound Controller 7 (default: Vibrato Rate - see MMA RP-021)',
	77: 'Sound Controller 8 (default: Vibrato Depth - see MMA RP-021)',
	78: 'Sound Controller 9 (default: Vibrato Delay - see MMA RP-021)',
	79: 'Sound Controller 10 (default undefined - see MMA RP-021)',
	80: 'General Purpose Controller 5',
	81: 'General Purpose Controller 6',
	82: 'General Purpose Controller 7',
	83: 'General Purpose Controller 8',
	84: 'Portamento Control',
	88: 'High Resolution Velocity Prefix',
	91: 'Effects 1 Depth (default: Reverb Send Level - see MMA RP-023) (formerly External Effects Depth)',
	92: 'Effects 2 Depth (formerly Tremolo Depth)',
	93: 'Effects 3 Depth (default: Chorus Send Level - see MMA RP-023) (formerly Chorus Depth)',
	94: 'Effects 4 Depth (formerly Celeste [Detune] Depth)',
	95: 'Effects 5 Depth (formerly Phaser Depth)',
	96: 'Data Increment (Data Entry +1) (see MMA RP-018)',
	97: 'Data Decrement (Data Entry -1) (see MMA RP-018)',
	98: 'Non-Registered Parameter Number (NRPN) - LSB',
	99: 'Non-Registered Parameter Number (NRPN) - MSB',
	100: 'Registered Parameter Number (RPN) - LSB*',
	101: 'Registered Parameter Number (RPN) - MSB*',

	120: '[Channel Mode Message] All Sound Off',
	121: '[Channel Mode Message] Reset All Controllers (See MMA RP-015)',
	122: '[Channel Mode Message] Local Control On/Off',
	123: '[Channel Mode Message] All Notes Off',
	124: '[Channel Mode Message] Omni Mode Off (+ all notes off)',
	125: '[Channel Mode Message] Omni Mode On (+ all notes off)',
	126: '[Channel Mode Message] Mono Mode On (+ poly off, + all notes off)',
	127: '[Channel Mode Message] Poly Mode On (+ mono off, +all notes off)',
}

export class ControlChange extends ChannelMessage {
	static predicate(data) {
		return (data[0] >> 4 & 0b0111) === 3
	}

	constructor(data, timeStamp, input) {
		super(data, timeStamp, input)
		this.type = 'Control Change'

		this.controller = CONTROLLER_MAP[data[1]] || data[1]
		this.value = data[2]
	}
}

Message.register(ControlChange)