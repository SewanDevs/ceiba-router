(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("stream"), require("gulp-util"), require("path"), require("upath"));
	else if(typeof define === 'function' && define.amd)
		define(["stream", "gulp-util", "path", "upath"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("stream"), require("gulp-util"), require("path"), require("upath")) : factory(root["stream"], root["gulp-util"], root["path"], root["upath"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_5__) {
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

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.default = gulpRestructureTree;

	var _stream = __webpack_require__(1);

	var _gulpUtil = __webpack_require__(2);

	var _path = __webpack_require__(3);

	var _path2 = _interopRequireDefault(_path);

	var _pathMatching = __webpack_require__(4);

	var _pathMatching2 = _interopRequireDefault(_pathMatching);

	var _SimpleCache = __webpack_require__(7);

	var _SimpleCache2 = _interopRequireDefault(_SimpleCache);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * Converts Windows path separator to Unix separators
	 */
	function toUnixSeparator(pth) {
	    return pth.replace(/\\/g, '/');
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
	            var pth = toUnixSeparator(file.relative);
	            if (isDir && pth) {
	                pth = pth + '/';
	            }
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
	    return new _pathMatching2.default(rules);
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
/* 1 */
/***/ function(module, exports) {

	module.exports = require("stream");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("gulp-util");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _upath = __webpack_require__(5);

	var _upath2 = _interopRequireDefault(_upath);

	var _utils = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	/* =Utilities
	 * ------------------------------------------------------------ */
	var warn = function warn() {
	    var _console;

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	    }

	    return (_console = console).warn.apply(_console, ['[path-matching] WARNING:'].concat(args));
	};

	/* =Tree compilation
	 * ------------------------------------------------------------ */

	var STRING_TESTS = {
	    REGEXP: /^\/.*\/$/,
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

	/**
	 * Prepare string to be passed through RegExp constructor while transforming
	 *   glob patterns.
	 */
	function preparePatternStringSegment(str) {
	    // Escape special RegExp characters except '*'
	    return str.replace(STRING_TESTS.REGEXP_CHARS, '\\$1').split(STRING_TESTS.GLOBSTAR)
	    // => [ theWholeTextIfThereIsNoGlobstar, "**", everythingAfter ]
	    .map(function (v, i) {
	        return (i + 1) % 2 === 0 ? // (**) part
	        // Replace unescaped '**' glob
	        v.replace(STRING_TESTS.GLOBSTAR, function (_match, _p1, p2) {
	            return '([^\\/]+/)*' + (p2 ? '[^\\/]*' + p2 : '');
	        }) : (i + 1) % 3 === 0 ? // (.*) part
	        v ? '[^\\/]*' + v : '' : // Else
	        // Replace unescaped '*' glob
	        v.replace(STRING_TESTS.STAR, '$1[^\\/]*');
	    }).join('');
	}

	/**
	 * @param {string[]} pattern
	 * @returns {RegExp}
	 */
	function compilePattern(pattern) {
	    var separators = Array(pattern.length).fill('/')
	    // Remove separators that come after a '**' segment
	    .map(function (s, i) {
	        return pattern[i] === '**' ? '' : '/';
	    });
	    var prepared = pattern.map(function (a, i) {
	        return STRING_TESTS.REGEXP.test(a) ?
	        // Embedded RegExp, we leave it alone for now
	        a.substring(1, Math.max(a.length - 1, 1)) : preparePatternStringSegment(a);
	    });
	    var segments = (0, _utils.dropLast)((0, _utils.interleave)(prepared, separators), 1);
	    return new RegExp(segments.join(''));
	}

	/**
	 * @typedef {Object} PathRule
	 * @property {string[]} match
	 * @property {RegExp} test
	 * @property {string|function} dest
	 */

	/**
	 * Normalize match patch: Merge consecutive '**' segments and append a '*' to
	 *   trailing '**' segment to match any file in folder)
	 */
	function preprocessMatchPath(match) {
	    var merged = (0, _utils.mergeConsecutive)(match, '**');
	    if (merged.length !== match.length) {
	        warn('Consecutive \'**\' globs found (' + (match.length - merged.length) + ' excess).');
	    }
	    return (0, _utils.mergeConsecutive)([].concat(_toConsumableArray(match), _toConsumableArray((0, _utils.last)(match) === '**' ? ['*'] : [])), '**');
	}

	/**
	 * Recursion helper pulled out of main function to optimize performance.
	 *   Push { match: branches, dest: leaf } objects depth-first into `paths`.
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

	            var newPath = [].concat(_toConsumableArray(path), [segment]);
	            if (!isPathMatchingTreeBranch(val)) {
	                // is leaf
	                paths.push({ match: preprocessMatchPath(newPath), dest: val }); // Partial PathRule
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
	        throw new TypeError('compilePathMatchingTree: Empty "tree" given (' + tree + ').');
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
	        var diffA = (0, _utils.dropWhileShared)(a, b);
	        if (diffA[0] === '**' && diffA[1] === '*') {
	            warn('Inaccessible paths: "' + a.join('/') + '" shadows following paths' + ' (will never match). Place more specifics paths on top.');
	        }
	        return b;
	    }, paths[0]);
	}

	/* =Rule retrieval and application
	 * ------------------------------------------------------------ */

	/**
	 * @param {PathRule[]} compiledPathMatching
	 * @param {string} path
	 * @returns {{ rule: PathRule, matches: string[] }|null}
	 */
	function getPathRule(compiledPathMatching, path) {
	    var _iteratorNormalCompletion2 = true;
	    var _didIteratorError2 = false;
	    var _iteratorError2 = undefined;

	    try {
	        for (var _iterator2 = compiledPathMatching[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	            var rule = _step2.value;

	            var matches = path.match(rule.test);
	            if (matches) {
	                return { rule: rule, matches: matches.slice(1) };
	            }
	        }
	    } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                _iterator2.return();
	            }
	        } finally {
	            if (_didIteratorError2) {
	                throw _iteratorError2;
	            }
	        }
	    }

	    return null;
	}

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
	    var unsharedPathSegments = (0, _utils.dropWhileShared)(pathSegments, match);
	    var matched = _upath2.default.join(dest, unsharedPathSegments.join('/'));
	    return matched;
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

	    var str = void 0;
	    if (typeof dest === 'function') {
	        var destResult = dest(Object.assign({}, _upath2.default.parse(pth), { full: pth }), match, test);
	        if (typeof destResult === 'string') {
	            str = matchPathWithDest(pth, destResult, match);
	        } else {
	            // Treat returned object as pathObject.
	            str = _upath2.default.format(destResult);
	        }
	    } else if (typeof dest === 'string') {
	        str = matchPathWithDest(pth, dest, match);
	    } else if (dest === null) {
	        return null;
	    } else {
	        throw new TypeError('applyPathRule: rule.dest of unsupported type ' + ('"' + (typeof dest === 'undefined' ? 'undefined' : _typeof(dest)) + '": ' + dest + '.'));
	    }
	    return (0, _utils.replaceMatches)(str, matches);
	}

	/* =Public interface
	 * ------------------------------------------------------------ */

	var PathMatcher = function () {
	    function PathMatcher(pathMatchingTree) {
	        _classCallCheck(this, PathMatcher);

	        this.rawTree = pathMatchingTree;
	        this.compiledTree = compilePathMatchingTree(pathMatchingTree);
	    }

	    _createClass(PathMatcher, [{
	        key: 'match',
	        value: function match(path) {
	            var _ref = getPathRule(this.compiledTree, path) || {},
	                rule = _ref.rule,
	                matches = _ref.matches;

	            if (!rule) {
	                throw new Error('PathMatcher.match: No rule found for "' + path + '"');
	            }
	            return applyPathRule(rule, matches, path);
	        }
	    }]);

	    return PathMatcher;
	}();

	// Unused but could become useful
	//function isRegularPathSegment(segment) {
	//    return !(STRING_TESTS.REGEXP.test(segment) ||
	//             STRING_TESTS.STAR.test(segment));
	//}


	exports.default = PathMatcher;
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("upath");

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.lastSameIndex = lastSameIndex;
	exports.keepDifferences = keepDifferences;
	exports.replaceMatches = replaceMatches;

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var not = exports.not = function not(fn) {
	    return function () {
	        return !fn.apply(undefined, arguments);
	    };
	};
	var take = exports.take = function take(arr, n) {
	    return arr.slice(0, n);
	};
	var takeWhile = exports.takeWhile = function takeWhile(arr, pred) {
	    var i = arr.findIndex(not(pred));
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
	    return diffIndex === -1 ? arr.length : diffIndex;
	}
	var dropWhileShared = exports.dropWhileShared = function dropWhileShared(a, b, eq) {
	    return a.slice(lastSameIndex(a, b, eq));
	};
	function keepDifferences(a, b, eq) {
	    var i = lastSameIndex(a, b, eq);
	    return [a.slice(i), b.slice(i)];
	}

	/**
	 * @example
	 * replaceMatches('Hello $1 how \\$2 you $3?', [ 'world', 'are' ])
	 * // => "Hello world how $2 you $3?"
	 * @param {string} str
	 * @param {string[]?} matches
	 * @returns {string}
	 */
	function replaceMatches(str, matches) {
	    if (!matches) {
	        return str;
	    }
	    var regexp = /([^\\]|^)\$([0-9]+)/g;
	    var replaceFn = function replaceFn(m, p1, matchIndex) {
	        return matches[matchIndex - 1] !== undefined ? '' + p1 + matches[matchIndex - 1] : m;
	    };
	    // We run the .replace twice to process consecutive patterns (needed
	    //   because of the lookbehind-less escape-check)
	    return str.replace(regexp, replaceFn).replace(regexp, replaceFn).replace(/\\\$([1-9])/, '\$$1');
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SimpleCache = function () {
	    function SimpleCache(cb) {
	        _classCallCheck(this, SimpleCache);

	        this.cache = new WeakMap();
	        this.cb = cb;
	    }

	    _createClass(SimpleCache, [{
	        key: "get",
	        value: function get(key, cb) {
	            if (this.cache.has(key)) {
	                return this.cache.get(key);
	            } else {
	                var res = (this.cb || cb)(key);
	                this.cache.set(key, res);
	                return res;
	            }
	        }
	    }]);

	    return SimpleCache;
	}();

	exports.default = SimpleCache;
	module.exports = exports["default"];

/***/ }
/******/ ])
});
;