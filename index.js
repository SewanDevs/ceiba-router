(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("stream"), require("gulp-util"), require("path"));
	else if(typeof define === 'function' && define.amd)
		define(["stream", "gulp-util", "path"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("stream"), require("gulp-util"), require("path")) : factory(root["stream"], root["gulp-util"], root["path"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__) {
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

	Object.keys(_gulpRestructureTree).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _gulpRestructureTree[key];
	    }
	  });
	});

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

	var _PathMatcher = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./PathMatcher\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _PathMatcher2 = _interopRequireDefault(_PathMatcher);

	var _SimpleCache = __webpack_require__(13);

	var _SimpleCache2 = _interopRequireDefault(_SimpleCache);

	var _string = __webpack_require__(12);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function mapFilename(pth, pathMatcher) {
	    var isDir = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	    // Signal to PathMatcher whether the file is a directory or not while
	    //  avoiding sending '/' instead of './'.
	    pth = ((0, _string.toUnixSeparator)(pth) || '.') + (isDir ? '/' : '');
	    return pathMatcher.match(pth);
	}

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
	            var pth = file.relative;
	            var newPth = mapFilename(pth, this.pathMatcher, isDir);
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

	var pathMatcherCache = new _SimpleCache2.default();

	var DEFAULT_OPTIONS = {
	    dryRun: false,
	    verbose: false,
	    logUnchanged: false,
	    onlyFiles: false,
	    bypassCache: false,
	    debug: false
	};

	function gulpRestructureTree(pathMoveRules) {
	    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	    var options = Object.assign({}, DEFAULT_OPTIONS, opts);

	    var createPathMatcher = function createPathMatcher() {
	        return new _PathMatcher2.default(pathMoveRules, { debug: options.debug });
	    };

	    var pathMatcher = !options.bypassCache ? pathMatcherCache.get(pathMoveRules, createPathMatcher) : createPathMatcher();

	    if (options.debug) {
	        (0, _gulpUtil.log)('[DEBUG]: pathMatcher.compiledTree: ', pathMatcher.compiledTree);
	    }

	    return new FileMoveTransform(pathMatcher, options);
	}

	gulpRestructureTree.mapFilename = mapFilename;
	gulpRestructureTree.PathMatcher = _PathMatcher2.default;
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
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */
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
	var min = exports.min = function min(a, b) {
	  return a > b ? b : a;
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.dropWhileShared = exports.mergeConsecutiveElements = exports.mergeConsecutive = exports.init = exports.last = exports.interleave = exports.intersperse = exports.flatten = exports.dropLast = exports.takeWhile = exports.take = undefined;
	exports.lastSameIndex = lastSameIndex;
	exports.firstDifferentIndex = firstDifferentIndex;
	exports.keepDifference = keepDifference;

	var _fp = __webpack_require__(10);

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
	function firstDifferentIndex(arr, other, eq) {
	    var i = lastSameIndex(arr, other, eq);
	    return (0, _fp.min)(i === -1 ? 0 : i + 1, arr.length);
	}
	var dropWhileShared = exports.dropWhileShared = function dropWhileShared(a, b, eq) {
	    return a.slice(firstDifferentIndex(a, b, eq));
	};
	function keepDifference(a, b, eq) {
	    var i = firstDifferentIndex(a, b, eq);
	    return [a.slice(i), b.slice(i)];
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.takeNLines = exports.repeatStr = exports.removeTrailing = exports.toUnixSeparator = exports.lastPathSegment = undefined;
	exports.replaceMatches = replaceMatches;
	exports.cropToNLines = cropToNLines;
	exports.escapeRegExpChars = escapeRegExpChars;

	var _array = __webpack_require__(11);

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
	            var _m2 = matches[p2_matchIndex];
	            return '' + p1 + (_m2 === undefined ? '' : _m2);
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

	var removeTrailing = exports.removeTrailing = function removeTrailing(s, c) {
	    return (0, _array.last)(s) === c ? s.substr(0, s.length - 1) : s;
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
	    return str.replace(/([.\[\]()|^$?*+\/\\{}])/g, '\\$1');
	}

/***/ },
/* 13 */
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

/***/ }
/******/ ])
});
;