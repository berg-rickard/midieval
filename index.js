var midieval =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _midievalMessage = __webpack_require__(1);

	var _note = __webpack_require__(2);

	function iterableToObservable(iterable) {
		return Rx.Observable.generate(iterable.next(), function (item) {
			return !item.done;
		}, function () {
			return iterable.next();
		}, function (item) {
			return item.value;
		});
	}

	var distinct = function distinct(selector) {
		var set = new Set();
		return function (item) {
			return set.has(selector(item)) ? false : !!set.add(selector(item));
		};
	};
	module.exports = function midieval() {
		var midi$ = Rx.Observable.fromPromise(navigator.requestMIDIAccess());

		var originalInput$ = midi$.map(function (_ref) {
			var inputs = _ref.inputs;
			return inputs.values();
		}).flatMap(iterableToObservable);

		var originalOutput$ = midi$.map(function (_ref2) {
			var outputs = _ref2.outputs;
			return outputs.values();
		}).flatMap(iterableToObservable);

		var newConnection$ = midi$.flatMap(function (midi) {
			return Rx.Observable.fromEvent(midi, 'statechange', function (_ref3) {
				var port = _ref3.port;
				return port;
			});
		}).filter(function (_ref4) {
			var state = _ref4.state;
			return state === 'connected';
		});

		var newInput$ = newConnection$.filter(function (port) {
			return port.type === 'input';
		});

		var input$ = originalInput$.merge(newInput$).filter(distinct(function (_ref5) {
			var id = _ref5.id;
			return id;
		}));

		var message$ = input$.flatMap(function (input) {
			return Rx.Observable.fromEvent(input, 'midimessage');
		}).map(function (_ref6) {
			var data = _ref6.data;
			var timeStamp = _ref6.timeStamp;
			return _midievalMessage.MidiEvalMessage.create(data, timeStamp);
		});

		return message$;
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var MidiEvalMessage = exports.MidiEvalMessage = function () {
		_createClass(MidiEvalMessage, [{
			key: 'type',
			get: function get() {
				return 'Unknown';
			}
		}], [{
			key: 'register',
			value: function register(klass) {
				MidiEvalMessage.classes.push(klass);
			}
		}, {
			key: 'create',
			value: function create(data, timeStamp) {
				var klass = MidiEvalMessage.classes.filter(function (klass) {
					return klass.predicate(data);
				})[0];
				return klass ? new klass(data, timeStamp) : new MidiEvalMessage(data, timeStamp);
			}
		}]);

		function MidiEvalMessage(data, timeStamp) {
			_classCallCheck(this, MidiEvalMessage);

			this._data = data;
			this.timeStamp = timeStamp;
		}

		return MidiEvalMessage;
	}();

	MidiEvalMessage.classes = [];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Note = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _midievalMessage = __webpack_require__(1);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var TYPE_MAP = ['Note Off', 'Note On', 'Aftertouch'];

	var NOTE_MAP = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

	var Note = exports.Note = function (_MidiEvalMessage) {
		_inherits(Note, _MidiEvalMessage);

		function Note() {
			_classCallCheck(this, Note);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(Note).apply(this, arguments));
		}

		_createClass(Note, [{
			key: 'type',
			get: function get() {
				var typeIndex = this._data[0] >> 4 & 7;
				return TYPE_MAP[typeIndex];
			}
		}, {
			key: 'note',
			get: function get() {
				var noteIndex = this._data[1] % 12;
				return NOTE_MAP[noteIndex];
			}
		}, {
			key: 'octave',
			get: function get() {
				return Math.floor(this._data[1] / 12 - 5);
			}
		}, {
			key: 'channel',
			get: function get() {
				return this._data[0] & 15 + 1;
			}
		}, {
			key: 'velocity',
			get: function get() {
				return this._data[2];
			}
		}], [{
			key: 'predicate',
			value: function predicate(data) {
				return (data[0] >> 4 & 7) < 3;
			}
		}]);

		return Note;
	}(_midievalMessage.MidiEvalMessage);

	_midievalMessage.MidiEvalMessage.register(Note);

/***/ }
/******/ ]);