(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("stream"), require("gulp-util"), require("path"), require("upath"));
	else if(typeof define === 'function' && define.amd)
		define(["stream", "gulp-util", "path", "upath"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("stream"), require("gulp-util"), require("path"), require("upath")) : factory(root["stream"], root["gulp-util"], root["path"], root["upath"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_9__) {
return /******/ (function(modules) { // webpackBootstrap
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

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _gulpRestructureTree = __webpack_require__(1);

	var _gulpRestructureTree2 = _interopRequireDefault(_gulpRestructureTree);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _gulpRestructureTree2.default;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.default = gulpRestructureTree;

	var _stream = __webpack_require__(2);

	var _gulpUtil = __webpack_require__(3);

	var _path = __webpack_require__(4);

	var _path2 = _interopRequireDefault(_path);

	var _PathMatcher = __webpack_require__(5);

	var _PathMatcher2 = _interopRequireDefault(_PathMatcher);

	var _SimpleCache = __webpack_require__(14);

	var _SimpleCache2 = _interopRequireDefault(_SimpleCache);

	var _string = __webpack_require__(13);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var FileMoveTransform = function (_Transform) {
	    _inherits(FileMoveTransform, _Transform);

	    function FileMoveTransform(pathMatcher, options) {
	        _classCallCheck(this, FileMoveTransform);

	        var _this = _possibleConstructorReturn(this, (FileMoveTransform.__proto__ || Object.getPrototypeOf(FileMoveTransform)).call(this, { objectMode: true }));

	        _this.pathMatcher = pathMatcher;
	        _this.options = options;
	        return _this;
	    }

	    _createClass(FileMoveTransform, [{
	        key: '_transform',
	        value: function _transform(file, _encoding, callback) {
	            var options = this.options;
	            var isDir = file.isDirectory();

	            if (options.onlyFiles && isDir) {
	                callback(null, file);
	                return;
	            }
	            // Signal to PathMatcher whether the file is a directory or not, and
	            //  avoid sending '/' instead of './'.
	            var pth = ((0, _string.toUnixSeparator)(file.relative) || '.') + (isDir ? '/' : '');
	            var newPth = this.pathMatcher.match(pth);
	            if (newPth === null) {
	                // Discard file
	                if (options.dryRun || options.verbose) {
	                    (0, _gulpUtil.log)('[restructureTree] ' + pth + ' => [REMOVED]');
	                }
	                callback();
	                return;
	            }

	            var newFile = file.clone({ contents: false });
	            if (options.dryRun || options.verbose) {
	                if (pth !== newPth && !options.logUnchanged) {
	                    (0, _gulpUtil.log)('[restructureTree] ' + pth + ' => ' + newPth);
	                }
	            }
	            if (!options.dryRun) {
	                newFile.path = _path2.default.join(newFile.base, newPth);
	            }
	            if (newFile.sourceMap) {
	                newFile.sourceMap.newFile = newFile.relative;
	            }
	            callback(null, newFile);
	        }
	    }]);

	    return FileMoveTransform;
	}(_stream.Transform);

	var pathMatcherCache = new _SimpleCache2.default(function (rules) {
	    return new _PathMatcher2.default(rules);
	});

	var DEFAULT_OPTIONS = {
	    dryRun: false,
	    verbose: false,
	    logUnchanged: false,
	    onlyFiles: false
	};

	function gulpRestructureTree(pathMoveRules) {
	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	    var pathMatcher = pathMatcherCache.get(pathMoveRules);

	    return new FileMoveTransform(pathMatcher, Object.assign({}, DEFAULT_OPTIONS, options));
	}
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("stream");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("gulp-util");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _PathMatcher = __webpack_require__(6);

	Object.keys(_PathMatcher).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _PathMatcher[key];
	    }
	  });
	});

	var _PathMatcher2 = _interopRequireDefault(_PathMatcher);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _PathMatcher2.default;
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _compileTree = __webpack_require__(7);

	var _compileTree2 = _interopRequireDefault(_compileTree);

	var _getRule = __webpack_require__(15);

	var _getRule2 = _interopRequireDefault(_getRule);

	var _applyRule = __webpack_require__(16);

	var _applyRule2 = _interopRequireDefault(_applyRule);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/* =Public interface
	 * ------------------------------------------------------------ */

	var PathMatcher = function () {
	    function PathMatcher(pathMatchingTree) {
	        _classCallCheck(this, PathMatcher);

	        this.rawTree = pathMatchingTree;
	        this.compiledTree = (0, _compileTree2.default)(pathMatchingTree);
	    }

	    _createClass(PathMatcher, [{
	        key: 'match',
	        value: function match(path) {
	            var _ref = (0, _getRule2.default)(this.compiledTree, path) || {},
	                rule = _ref.rule,
	                matches = _ref.matches;

	            if (!rule) {
	                throw new Error('PathMatcher.match: No rule found for "' + path + '"');
	            }
	            return (0, _applyRule2.default)(rule, matches, path);
	        }
	    }]);

	    return PathMatcher;
	}();

	exports.default = PathMatcher;
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.isCapturingPathSegment = undefined;

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	exports.isSolidPathSegment = isSolidPathSegment;
	exports.default = compilePathMatchingTree;

	var _helpers = __webpack_require__(8);

	var _utils = __webpack_require__(10);

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	/* =Tree compilation
	 * ------------------------------------------------------------ */

	var STRING_TESTS = {
	    REGEXP: /^\/.*\/$/,
	    ARRAY: /([^\\]|^),/,
	    REGEXP_CHARS: /([.\]\[)(|^$?])/g,
	    GLOBSTAR: /^(\*\*)(.*)/,
	    STAR: /([^\\]|^)\*/g
	};

	/**
	 * @returns {boolean} true if tree node is a branch (path segment), false if
	 *   it's a leaf (destination).
	 */
	function isPathMatchingTreeBranch(val) {
	    return !(typeof val === 'string' || typeof val === 'function' || val === null);
	}

	function isSolidPathSegment(segment) {
	    return ![STRING_TESTS.REGEXP, STRING_TESTS.STAR, STRING_TESTS.ARRAY].some(function (t) {
	        return t.test(segment);
	    });
	}

	var isCapturingPathSegment = exports.isCapturingPathSegment = (0, _utils.not)(isSolidPathSegment);

	/** Escape special RegExp characters except '*' */
	var escapeRegExpChars = function escapeRegExpChars(s) {
	    return s.replace(STRING_TESTS.REGEXP_CHARS, '\\$1');
	};

	/** Transform globs into RegExp string */
	function globsToRegExpStr(str) {
	    return str.split(STRING_TESTS.GLOBSTAR)
	    // => [ theWholeTextIfThereIsNoGlobstar, "**", everythingAfter ]
	    .map(function (v, i) {
	        return (i + 1) % 2 === 0 ? // (**) part
	        // Replace unescaped '**' glob
	        v.replace(STRING_TESTS.GLOBSTAR, function (_match, _p1, p2) {
	            return '([^\\/]+/+)*' + (p2 ? '[^\\/]*' + p2 : '');
	        }) : (i + 1) % 3 === 0 ? // (everythingElse) part
	        v ? '[^\\/]*' + v : '' : // Else
	        // Replace unescaped '*' glob
	        v.replace(STRING_TESTS.STAR, '$1([^\\/]*)');
	    }).join('');
	}

	var _transformSegment = function _transformSegment(s) {
	    return globsToRegExpStr(escapeRegExpChars(s));
	};

	var arrayToORRegExpStr = function arrayToORRegExpStr(ss) {
	    return '(' + ss.join('|') + ')';
	};

	/**
	 * Prepare string to be passed through RegExp constructor while transforming
	 *   glob patterns.
	 */
	function preparePatternStringSegment(str) {
	    if (STRING_TESTS.ARRAY.test(str)) {
	        var els = str.replace(/([^\\]),/g, "$1$1,").split(/[^\\],/);
	        return arrayToORRegExpStr(els.map(_transformSegment));
	    } else {
	        return _transformSegment(str);
	    }
	}

	/**
	 * @param {string[]} matches
	 * @returns {RegExp}
	 */
	function compilePattern(matches) {
	    var separators = Array(matches.length).fill('/')
	    // Remove separators that come after a '**' segment
	    .map(function (s, i) {
	        return matches[i] === '**' ? '' : '/';
	    });
	    var prepared = matches.map(function (a, i) {
	        return STRING_TESTS.REGEXP.test(a) ?
	        // Embedded RegExp, we leave it alone for now
	        a.substring(1, Math.max(a.length - 1, 1)) : preparePatternStringSegment(a);
	    });

	    var segments = (0, _utils.dropLast)((0, _utils.interleave)(prepared, separators), 1);
	    // Remove trailing separator since it would be duplicated by the following
	    //  process.
	    if (segments.length > 1 && (0, _utils.last)(segments) === '/') {
	        segments = (0, _utils.init)(segments);
	    }
	    return new RegExp('^' + segments.join('') + '$');
	}

	/**
	 * @typedef {Object} PathRule
	 * @property {string[]} match
	 * @property {RegExp} test
	 * @property {string|function|null} dest
	 */

	/**
	 * @example
	 * isolateGlobstarPattern(['foo', '**.css', 'bar'])
	 * => ['foo', '**', '*.css', 'bar]
	 */
	function isolateGlobstarPattern(segments) {
	    return (0, _utils.flatten)(segments.map(function (m) {
	        if (!/^(\*\*)(.+)/.test(m)) {
	            return m;
	        } else {
	            var ma = m.match(/^(\*\*)(.+)/);
	            return [ma[1], '*' + ma[2]];
	        }
	    }));
	}

	/**
	 * Normalize match path: Merge consecutive '**' segments and append a '*' to
	 *   trailing '**' segment to match any file in folder)
	 */
	function preprocessMatchPath(segments) {
	    var merged = (0, _utils.mergeConsecutive)(segments, '**');
	    if (merged.length !== segments.length) {
	        (0, _helpers.warn)('Consecutive \'**\' globs found\n              (' + (segments.length - merged.length) + ' excess).');
	    }
	    segments = isolateGlobstarPattern(segments);
	    return (0, _utils.mergeConsecutive)([].concat(_toConsumableArray(segments), _toConsumableArray((0, _utils.last)(segments) === '**' ? ['*'] : [])), '**');
	}

	/**
	 * Recursion helper pulled out of main function to optimize performance.
	 *  Push { match: branches, dest: leaf } objects depth-first into `paths`.
	 */
	function _compileMatchingTree_flattenHelper(tree) {
	    var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	    var paths = arguments[2];
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	        for (var _iterator = Object.entries(tree)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var _step$value = _slicedToArray(_step.value, 2),
	                segment = _step$value[0],
	                val = _step$value[1];

	            if (/^(0|[1-9][0-9]*)$/.test(segment)) {
	                // Is an integer key
	                (0, _helpers.warn)('Integer keys will come first in object iteration even if ' + 'other keys are defined before. Wrap key with \'/\' to avoid ' + ('this behavior ("' + segment + '" => "/' + segment + '/").'));
	            }
	            var newPath = [].concat(_toConsumableArray(path), [segment]);
	            if (!isPathMatchingTreeBranch(val)) {
	                // is leaf
	                // Partial PathRule
	                paths.push({ match: preprocessMatchPath(newPath), dest: val });
	                continue;
	            }
	            _compileMatchingTree_flattenHelper(val, newPath, paths);
	        }
	    } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion && _iterator.return) {
	                _iterator.return();
	            }
	        } finally {
	            if (_didIteratorError) {
	                throw _iteratorError;
	            }
	        }
	    }
	}

	/**
	 * @returns {PathRule[]}
	 */
	function compilePathMatchingTree(tree) {
	    if (!tree) {
	        throw new TypeError('compilePathMatchingTree: Empty "tree"' + (' given (' + tree + ').'));
	    }
	    var matchingPaths = [];
	    _compileMatchingTree_flattenHelper(tree, [], matchingPaths);
	    matchingPaths.forEach(function (mp) {
	        mp.test = compilePattern(mp.match);
	    });
	    checkTree(matchingPaths);
	    return matchingPaths;
	}

	function checkTree(mp) {
	    if (mp.length <= 1) {
	        // Only one rule, nothing to check
	        return true;
	    }
	    var paths = mp.map(function (rule) {
	        return rule.match;
	    });
	    paths.slice(1).reduce(function (a, b) {
	        var _keepDifference = (0, _utils.keepDifference)(a, b),
	            _keepDifference2 = _slicedToArray(_keepDifference, 2),
	            diffA = _keepDifference2[0],
	            diffB = _keepDifference2[1];

	        if (diffA[0] === '**' && diffA[1] === '*' && !(diffB.length === 1 && diffB[0] === '/')) {
	            (0, _helpers.warn)('Inaccessible paths: "' + a.join('/') + '" shadows following ' + 'paths (will never match). Place more specifics rules on top.');
	        }
	        return b;
	    }, paths[0]);
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.parsePath = exports.ParsedPath = exports.warn = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _upath = __webpack_require__(9);

	var _upath2 = _interopRequireDefault(_upath);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var warn = exports.warn = function warn() {
	    var _console;

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	    }

	    return (_console = console).warn.apply(_console, ['[path-matching] WARNING:'].concat(args));
	};

	/**
	 * Result of path.parse plus `full` property and `toString` method.
	 * @property {string} full - Original path given in constructor
	 * @method {string} toString - Returns full
	 */

	var ParsedPath = exports.ParsedPath = function () {
	    function ParsedPath(pth) {
	        _classCallCheck(this, ParsedPath);

	        Object.assign(this, _upath2.default.parse(pth));
	        this.full = pth;
	    }

	    _createClass(ParsedPath, [{
	        key: 'toString',
	        value: function toString() {
	            return this.full;
	        }
	    }]);

	    return ParsedPath;
	}();

	var parsePath = exports.parsePath = function parsePath(pth) {
	    return new ParsedPath(pth);
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("upath");

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.SimpleCache = undefined;

	var _fp = __webpack_require__(11);

	Object.keys(_fp).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _fp[key];
	    }
	  });
	});

	var _array = __webpack_require__(12);

	Object.keys(_array).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _array[key];
	    }
	  });
	});

	var _string = __webpack_require__(13);

	Object.keys(_string).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _string[key];
	    }
	  });
	});

	var _SimpleCache = __webpack_require__(14);

	var _SimpleCache2 = _interopRequireDefault(_SimpleCache);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.SimpleCache = _SimpleCache2.default;

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var identity = exports.identity = function identity(a) {
	  return a;
	};
	var not = exports.not = function not(fn) {
	  return function () {
	    return !fn.apply(undefined, arguments);
	  };
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.dropWhileShared = exports.mergeConsecutiveElements = exports.mergeConsecutive = exports.init = exports.last = exports.interleave = exports.intersperse = exports.flatten = exports.dropLast = exports.takeWhile = exports.take = undefined;
	exports.lastSameIndex = lastSameIndex;
	exports.keepDifference = keepDifference;

	var _fp = __webpack_require__(11);

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var take = exports.take = function take(arr, n) {
	    return arr.slice(0, n);
	};
	var takeWhile = exports.takeWhile = function takeWhile(arr, pred) {
	    var i = arr.findIndex((0, _fp.not)(pred));
	    return take(arr, i === -1 ? arr.length : i);
	};
	var dropLast = exports.dropLast = function dropLast(arr) {
	    var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
	    return arr.slice(0, arr.length - n);
	};
	var flatten = exports.flatten = function flatten(arr) {
	    var _ref;

	    return (_ref = []).concat.apply(_ref, _toConsumableArray(arr));
	};
	var intersperse = exports.intersperse = function intersperse(arr, sep) {
	    return flatten(arr.map(function (v) {
	        return [sep, v];
	    })).slice(1);
	};
	var interleave = exports.interleave = function interleave(a, b) {
	    return flatten(a.slice(0, b.length).map(function (v, i) {
	        return [v, b[i]];
	    }));
	};
	var last = exports.last = function last(a) {
	    return a[a.length - 1];
	};
	var init = exports.init = function init(a) {
	    return a.slice(0, a.length - 1);
	};
	var mergeConsecutive = exports.mergeConsecutive = function mergeConsecutive(arr, el) {
	    return arr.length <= 1 ? arr : arr.slice(1).reduce(function (p, v) {
	        return v === el && last(p) === v ? p : [].concat(_toConsumableArray(p), [v]);
	    }, [arr[0]]);
	};
	var mergeConsecutiveElements = exports.mergeConsecutiveElements = function mergeConsecutiveElements(arr) {
	    return arr.length <= 1 ? arr : arr.slice(1).reduce(function (p, v) {
	        return last(p) === v ? p : [].concat(_toConsumableArray(p), [v]);
	    }, [arr[0]]);
	};

	function lastSameIndex(arr, other) {
	    var eq = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (a, b) {
	        return a === b;
	    };

	    var diffIndex = arr.findIndex(function (val, i) {
	        return !eq(other[i], val);
	    });
	    return (diffIndex === -1 ? arr.length : diffIndex) - 1;
	}
	var dropWhileShared = exports.dropWhileShared = function dropWhileShared(a, b, eq) {
	    return a.slice(lastSameIndex(a, b, eq) + 1 || a.length);
	};
	function keepDifference(a, b, eq) {
	    var i = lastSameIndex(a, b, eq) + 1 || a.length;
	    return [a.slice(i), b.slice(i)];
	}

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.replaceMatches = replaceMatches;
	exports.cropToNLines = cropToNLines;
	/**
	 * @example
	 * replaceMatches('Hello $1 how \\$2 you $3?', [ 'world', 'are' ])
	 * // => "Hello world how $2 you $3?"
	 * @param {string} str
	 * @param {string[]?} matches
	 * @param {object?} indexes - Modified in place. Indexes which have been
	 *   replaced will be set to true.
	 * @returns {string}
	 */
	function replaceMatches(str) {
	    var matches = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	    var indexes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	    var regexp = /([^\$]|^)\$([0-9]+)/g;
	    var replaceFn = function replaceFn(m, p1, p2_matchIndex) {
	        if (0 > p2_matchIndex || p2_matchIndex >= matches.length) {
	            return m;
	        } else {
	            indexes[p2_matchIndex] = true;
	            return '' + p1 + matches[p2_matchIndex];
	        }
	    };
	    // We run the .replace twice to process consecutive patterns (needed
	    //   because of the lookbehind-less escape-check)
	    return str.replace(regexp, replaceFn).replace(regexp, replaceFn).replace(/\$\$([0-9])/, function (_m, p1) {
	        return '$' + p1;
	    });
	}

	var lastPathSegment = exports.lastPathSegment = function lastPathSegment(pth) {
	    return pth.match(/([^\/]*)$/)[1];
	};

	/**
	 * Converts Windows path separator to Unix separators
	 */
	var toUnixSeparator = exports.toUnixSeparator = function toUnixSeparator(pth) {
	    return pth.replace(/\\/g, '/');
	};

	var repeatStr = exports.repeatStr = function repeatStr(str, times) {
	    return Array(times + 1).join(str);
	};

	var takeNLines = exports.takeNLines = function takeNLines(str, n) {
	    return str.replace(new RegExp('^((.*\\n){' + n + '})(.*\\n?)*$'), '$1');
	};

	function cropToNLines(str, n) {
	    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
	        _ref$ellipsisStr = _ref.ellipsisStr,
	        ellipsisStr = _ref$ellipsisStr === undefined ? '...' : _ref$ellipsisStr,
	        _ref$keepIndent = _ref.keepIndent,
	        keepIndent = _ref$keepIndent === undefined ? true : _ref$keepIndent;

	    var firstNLines = takeNLines(str, n);
	    if (firstNLines === str) {
	        return str;
	    }
	    var indent = keepIndent ? firstNLines.match(/\n([ \t]+)[^\n]*\n?$/) : null;
	    return '' + firstNLines + (indent && indent[1] || '') + ellipsisStr;
	}

	function escapeRegExpChars(str) {
	    return str.replace(/([.\]\[)(|^$?*\/\\])/g, '\\$1');
	}

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SimpleCache = function () {
	    function SimpleCache(cb) {
	        _classCallCheck(this, SimpleCache);

	        this.objectCache = new WeakMap();
	        this.primitiveCache = new Map();
	        this.cb = cb;
	    }

	    _createClass(SimpleCache, [{
	        key: 'getCache',
	        value: function getCache(key) {
	            return (typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object' ? this.objectCache : this.primitiveCache;
	        }
	    }, {
	        key: 'get',
	        value: function get(key, cb) {
	            var cache = this.getCache(key);
	            if (cache.has(key)) {
	                return cache.get(key);
	            } else {
	                var res = (cb || this.cb)(key);
	                cache.set(key, res);
	                return res;
	            }
	        }
	    }]);

	    return SimpleCache;
	}();

	exports.default = SimpleCache;
	module.exports = exports['default'];

/***/ },
/* 15 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = getPathRule;
	/**
	 * @param {PathRule[]} compiledPathMatching
	 * @param {string} path
	 * @returns {{ rule: PathRule, matches: string[] }|null}
	 */
	function getPathRule(compiledPathMatching, path) {
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	        for (var _iterator = compiledPathMatching[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var rule = _step.value;

	            var matches = path.match(rule.test);
	            if (matches) {
	                return { rule: rule, matches: matches };
	            }
	        }
	    } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion && _iterator.return) {
	                _iterator.return();
	            }
	        } finally {
	            if (_didIteratorError) {
	                throw _iteratorError;
	            }
	        }
	    }

	    return null;
	}
	module.exports = exports["default"];

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	exports.default = applyPathRule;

	var _upath = __webpack_require__(9);

	var _upath2 = _interopRequireDefault(_upath);

	var _utils = __webpack_require__(10);

	var _compileTree = __webpack_require__(7);

	var _helpers = __webpack_require__(8);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	/**
	 * Resolves final file destination path from matched path
	 * @param {string} pth
	 * @param {PathRule.dest} dest
	 * @param {PathRule.match} match
	 * @returns {string} transformed path
	 * @example
	 * matchPathWithDest('foo/bar/baz', 'qux/', [ 'foo', 'bar 'baz' ])
	 * // => 'qux/baz'
	 * @example
	 * matchPathWithDest('foo/bar/baz', 'qux/', [ '**' ])
	 * // => 'qux/foo/bar/baz'
	 * @example
	 * matchPathWithDest('foo/bar/baz', 'qux/', [ 'foo', '**', 'baz' ])
	 * // => 'qux/bar/baz'
	 */
	function matchPathWithDest(pth, dest, match) {
	    var pathSegments = pth.split('/');
	    var isDir = /\/$/.test(dest);
	    var filename = isDir ? (0, _utils.last)(pathSegments) : (0, _utils.lastPathSegment)(dest);
	    var unsharedPathSegments = isDir ? (0, _utils.dropWhileShared)((0, _utils.init)(pathSegments), match) : [];
	    var matched = _upath2.default.join.apply(_upath2.default, [isDir ? dest : _upath2.default.dirname(dest)].concat(_toConsumableArray(unsharedPathSegments), [filename]));
	    return matched;
	}

	function replaceMatched(origMatch, matches, matchedIndexes) {
	    var match = origMatch.slice();
	    for (var i = 1; matchedIndexes[i]; i++) {
	        match[match.findIndex(_compileTree.isCapturingPathSegment)] = matches[i];
	    }
	    return match;
	}

	/**
	 * @param {PathRule} rule
	 * @param {string[]|undefined} matches
	 * @param {string} pth
	 * @returns {string|null} moved path
	 */
	function applyPathRule(rule, matches, pth) {
	    if (!rule) {
	        throw new TypeError('applyPathRule: No rule given (' + rule + ').');
	    }
	    var test = rule.test,
	        dest = rule.dest,
	        match = rule.match;

	    if (!test && test !== "" || !dest && dest !== "" && dest !== null) {
	        throw new TypeError('applyPathRule: Malformed rule given: ' + (!test && test !== "" ? ' empty "test" field (' + test + ')' : '') + (!dest && dest !== "" && dest !== null ? ' empty "dest" field (' + dest + ')' : '') + '.');
	    }

	    var destStr = void 0;
	    if (typeof dest === 'function') {
	        destStr = dest((0, _helpers.parsePath)(pth), match, matches, test);
	        if (destStr === null) {
	            return null;
	        } else if ((typeof destStr === 'undefined' ? 'undefined' : _typeof(destStr)) === 'object') {
	            try {
	                // Treat returned object as pathObject.
	                return _upath2.default.format(destStr);
	            } catch (e) {
	                if (e instanceof TypeError) {
	                    throw new TypeError('applyPathRule: Invalid object returned from function' + (' argument: ' + JSON.stringify(destStr) + ', sould be ') + 'pathObject (parsable by path.format()), \n' + ('(function argument: "' + (0, _utils.cropToNLines)(dest.toString(), 3, { ellipsisStr: '[cropped...]' }) + '").'));
	                } else {
	                    throw e;
	                }
	            }
	        }
	    } else if (typeof dest === 'string') {
	        destStr = dest;
	    } else if (dest === null) {
	        return null;
	    } else {
	        throw new TypeError('applyPathRule: rule.dest of unsupported type ' + ('"' + (typeof dest === 'undefined' ? 'undefined' : _typeof(dest)) + '": ' + dest + '.'));
	    }
	    var matchedIndexes = {}; // Modified in place by replaceMatches
	    destStr = (0, _utils.replaceMatches)(destStr, matches, matchedIndexes);
	    var replacedMatch = replaceMatched(match, matches, matchedIndexes);
	    return matchPathWithDest(pth, destStr, replacedMatch);
	}
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;