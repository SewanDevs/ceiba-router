(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("path-matcher-utils"), require("unix-path"), require("gulp-util"), require("path"), require("stream"));
	else if(typeof define === 'function' && define.amd)
		define(["path-matcher-utils", "unix-path", "gulp-util", "path", "stream"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("path-matcher-utils"), require("unix-path"), require("gulp-util"), require("path"), require("stream")) : factory(root["path-matcher-utils"], root["unix-path"], root["gulp-util"], root["path"], root["stream"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_11__, __WEBPACK_EXTERNAL_MODULE_12__, __WEBPACK_EXTERNAL_MODULE_14__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isCapturingPathSegment = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.isSolidPathSegment = isSolidPathSegment;
exports.default = compilePathMatchingTree;

var _warn = __webpack_require__(1);

var _warn2 = _interopRequireDefault(_warn);

var _pathMatcherUtils = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    return (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && val !== null;
}

function isSolidPathSegment(segment) {
    return ![STRING_TESTS.REGEXP, STRING_TESTS.STAR, STRING_TESTS.ARRAY].some(function (t) {
        return t.test(segment);
    });
}

var isCapturingPathSegment = exports.isCapturingPathSegment = (0, _pathMatcherUtils.not)(isSolidPathSegment);

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

    var regexpSegments = (0, _pathMatcherUtils.dropLast)((0, _pathMatcherUtils.interleave)(prepared, separators), 1);
    // Remove trailing separator since it would be duplicated by the following
    //  process.
    if (regexpSegments.length > 1 && (0, _pathMatcherUtils.last)(regexpSegments) === '/') {
        regexpSegments = (0, _pathMatcherUtils.init)(regexpSegments);
    }
    return new RegExp('^' + regexpSegments.join('') + '$');
}

/**
 * @typedef {Object} PathRule - Match information
 * @property {string[]} match - Array of segments leading up to matched path.
 * @property {RegExp} test - RegExp test that returns true when applied
 *  to matched path.
 * @property {string|function|null} dest - Value corresponding to matched path.
 */

/**
 * Separate compound globstar-expression patterns in given array
 * @param {string[]} segments
 * @example
 * isolateGlobstarPattern(['foo', '**.css', 'bar'])
 * => ['foo', '**', '*.css', 'bar]
 */
function isolateGlobstarPattern(segments) {
    return (0, _pathMatcherUtils.flatten)(segments.map(function (m) {
        if (!/^(\*\*)(.+)/.test(m)) {
            return m;
        } else {
            var ma = m.match(/^(\*\*)(.+)/);
            return [ma[1], '*' + ma[2]];
        }
    }));
}

function appendGlobstarIfTrailingSlash(segments) {
    var end = (0, _pathMatcherUtils.last)(segments);
    if (!/.\/$/.test(end) || STRING_TESTS.REGEXP.test(end)) {
        return segments;
    }
    return [].concat(_toConsumableArray((0, _pathMatcherUtils.init)(segments)), [(0, _pathMatcherUtils.removeTrailing)(end, '/'), '**']);
}

/**
 * Normalize match path: Merge consecutive '**' segments and append a '*' to
 *   trailing '**' segment to match any file in folder)
 */
function preprocessMatchPath(segments) {
    var merged = (0, _pathMatcherUtils.mergeConsecutive)(segments, '**');
    if (merged.length !== segments.length) {
        (0, _warn2.default)('Consecutive \'**\' globs found\n              (' + (segments.length - merged.length) + ' excess).');
    }
    segments = isolateGlobstarPattern(segments);
    segments = appendGlobstarIfTrailingSlash(segments);
    return (0, _pathMatcherUtils.mergeConsecutive)([].concat(_toConsumableArray(segments), _toConsumableArray((0, _pathMatcherUtils.last)(segments) === '**' ? ['*'] : [])), '**');
}

/**
 * @returns {PathRule[]}
 */
function compilePathMatchingTree(tree) {
    if (!tree || (typeof tree === 'undefined' ? 'undefined' : _typeof(tree)) !== 'object') {
        throw new TypeError('compilePathMatchingTree: Invalid "tree"' + (' given ([' + (typeof tree === 'undefined' ? 'undefined' : _typeof(tree)) + ']' + tree + ').'));
    }
    var matchingPaths = _pathMatcherUtils.AdHocTree.getSlices(tree).map(function (_ref) {
        var path = _ref.path,
            leaf = _ref.leaf;

        var match = preprocessMatchPath(path);
        return { match: match, test: compilePattern(match), dest: leaf };
    });
    checkTree(matchingPaths);
    return matchingPaths;
}

/**
 * Doesn't modify passed argument
 */
function checkTree(mp) {
    var paths = mp.map(function (rule) {
        return rule.match;
    });
    paths.forEach(function (path) {
        return checkPath(path);
    });
    if (paths.length <= 1) {
        // Only one rule, no need to check for shadowing
        return true;
    }
    paths.reduce(function (a, b) {
        var _keepDifference = (0, _pathMatcherUtils.keepDifference)(a, b),
            _keepDifference2 = _slicedToArray(_keepDifference, 2),
            diffA = _keepDifference2[0],
            diffB = _keepDifference2[1];

        if (diffA[0] === '**' && diffA[1] === '*' && !(diffB.length === 1 && diffB[0] === '/')) {
            (0, _warn2.default)('Inaccessible paths: "' + a.join('/') + '" shadows following ' + 'paths (will never match). Place more specifics rules on top.');
        }
        return b;
    });
}

/**
 * Doesn't modify passed argument
 */
function checkPath(path) {
    var integerKeySegments = path.filter(function (segment) {
        return (/^(0|[1-9][0-9]*)$/.test(segment)
        );
    });
    if (integerKeySegments.length) {
        (0, _warn2.default)('Integer keys will come first in object iteration even if ' + 'other keys are defined before. Wrap key with \'/\' to avoid ' + ('this behavior (' + integerKeySegments.map(function (segment) {
            return '"' + segment + '" => "/' + segment + '/"';
        }).join(', ') + ').'));
    }
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
                                         value: true
});

exports.default = function () {
                                         var _console;

                                         for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                                                                                  args[_key] = arguments[_key];
                                         }

                                         return (_console = console).warn.apply(_console, ['[path-matching] WARNING:'].concat(args));
};

module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("path-matcher-utils");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("unix-path");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = gulpRestructureTree;

var _stream = __webpack_require__(14);

var _gulpUtil = __webpack_require__(11);

var _path = __webpack_require__(12);

var _path2 = _interopRequireDefault(_path);

var _pathMatcher = __webpack_require__(10);

var _pathMatcher2 = _interopRequireDefault(_pathMatcher);

var _pathMatcherUtils = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function mapFilename(pth, pathMatcher) {
    var isDir = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    // Signal to PathMatcher whether the file is a directory or not while
    //  avoiding sending '/' instead of './'.
    pth = ((0, _pathMatcherUtils.toUnixSeparator)(pth) || '.') + (isDir ? '/' : '');
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

var pathMatcherCache = new _pathMatcherUtils.SimpleCache();

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
        return new _pathMatcher2.default(pathMoveRules, { debug: options.debug });
    };

    var pathMatcher = !options.bypassCache ? pathMatcherCache.get(pathMoveRules, createPathMatcher) : createPathMatcher();

    if (options.debug) {
        (0, _gulpUtil.log)('[DEBUG]: pathMatcher.compiledTree: ', pathMatcher.compiledTree);
    }

    return new FileMoveTransform(pathMatcher, options);
}

gulpRestructureTree.mapFilename = mapFilename;
gulpRestructureTree.PathMatcher = _pathMatcher2.default;
module.exports = exports['default'];

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var gulpRestructureTree = __webpack_require__(4);
module.exports = gulpRestructureTree;
//export * from './gulp-restructure-tree';
//import gulpRestructureTree from './gulp-restructure-tree';
//export default gulpRestructureTree;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _compileTree = __webpack_require__(0);

var _compileTree2 = _interopRequireDefault(_compileTree);

var _getRule = __webpack_require__(8);

var _getRule2 = _interopRequireDefault(_getRule);

var _applyRule = __webpack_require__(7);

var _applyRule2 = _interopRequireDefault(_applyRule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* =Public interface
 * ------------------------------------------------------------ */

var PathMatcher = function () {
    function PathMatcher(pathMatchingTree) {
        _classCallCheck(this, PathMatcher);

        this.compiledTree = (0, _compileTree2.default)(pathMatchingTree);

        this.rawTree = pathMatchingTree;
        this.getRule = _getRule2.default;
        this.applyRule = _applyRule2.default;
    }

    /**
     * @param {string} path
     */


    _createClass(PathMatcher, [{
        key: 'match',
        value: function match(path) {
            var _ref = this.getRule(this.compiledTree, path) || {},
                rule = _ref.rule,
                matches = _ref.matches;

            if (!rule) {
                throw new Error('PathMatcher.match: No rule found for "' + path + '"');
            }
            return this.applyRule(rule, matches, path);
        }
    }]);

    return PathMatcher;
}();

exports.default = PathMatcher;
module.exports = exports['default'];

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.matchPathWithDest = matchPathWithDest;
exports.replaceMatched = replaceMatched;
exports.isPathObject = isPathObject;
exports.formatPathObject = formatPathObject;
exports.applyPathRule = applyPathRule;

var _unixPath = __webpack_require__(3);

var _unixPath2 = _interopRequireDefault(_unixPath);

var _pathMatcherUtils = __webpack_require__(2);

var _compileTree = __webpack_require__(0);

var _helpers = __webpack_require__(9);

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
    var filename = isDir ? (0, _pathMatcherUtils.last)(pathSegments) : (0, _pathMatcherUtils.lastPathSegment)(dest);
    var unsharedPathSegments = isDir ? (0, _pathMatcherUtils.dropWhileShared)((0, _pathMatcherUtils.init)(pathSegments), match) : [];
    var matched = _unixPath2.default.join.apply(_unixPath2.default, [isDir ? dest : _unixPath2.default.dirname(dest)].concat(_toConsumableArray(unsharedPathSegments), [filename]));
    return matched;
}

function replaceMatched(origMatch, matches, matchedIndexes) {
    var match = origMatch.slice();
    for (var i = 1; matchedIndexes[i]; i++) {
        match[match.findIndex(_compileTree.isCapturingPathSegment)] = matches[i];
    }
    return match;
}

function isPathObject(obj) {
    return ['dir', 'root', 'base', 'name', 'ext'].some(function (prop) {
        return prop in obj;
    });
}

function formatPathObject(obj, destFn) {
    if (isPathObject(obj)) {
        try {
            // Treat returned object as pathObject.
            return _unixPath2.default.format(obj);
        } catch (e) {
            if (!e instanceof TypeError) {
                throw e;
            }
        }
    }
    throw new TypeError('applyPathRule: Invalid object returned from function' + (' argument: ' + JSON.stringify(obj) + ', sould be a') + 'pathObject (acceptable by path.format()), \n' + ('(function argument: "' + (0, _pathMatcherUtils.cropToNLines)(destFn.toString(), 3, { ellipsisStr: '[cropped...]' }) + '").'));
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
        var result = dest((0, _helpers.parsePath)(pth), match, matches, test);
        if (result === null) {
            return null;
        } else if ((typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object') {
            return formatPathObject(result, dest);
        } else if (typeof result === 'string') {
            destStr = (0, _pathMatcherUtils.toUnixSeparator)(result);
        }
    } else if (typeof dest === 'string') {
        destStr = dest;
    } else if (dest === null) {
        return null;
    } else {
        throw new TypeError('applyPathRule: rule.dest of unsupported type ' + ('"' + (typeof dest === 'undefined' ? 'undefined' : _typeof(dest)) + '": ' + dest + '.'));
    }
    var matchedIndexes = {}; // Modified in place by replaceMatches
    destStr = (0, _pathMatcherUtils.replaceMatches)(destStr, matches, matchedIndexes);
    var replacedMatch = replaceMatched(match, matches, matchedIndexes);
    return matchPathWithDest(pth, destStr, replacedMatch);
}
exports.default = applyPathRule;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

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

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.warn = exports.parsePath = exports.ParsedPath = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _unixPath = __webpack_require__(3);

var _unixPath2 = _interopRequireDefault(_unixPath);

var _warn = __webpack_require__(1);

var _warn2 = _interopRequireDefault(_warn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Result of path.parse plus `full` property and `toString` method.
 * @property {string} full - Original path given in constructor
 * @method {string} toString - Returns full
 */
var ParsedPath = exports.ParsedPath = function () {
    function ParsedPath(pth) {
        _classCallCheck(this, ParsedPath);

        Object.assign(this, _unixPath2.default.parse(pth));
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

var parsePath = exports.parsePath = function parsePath() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    return new (Function.prototype.bind.apply(ParsedPath, [null].concat(args)))();
};

exports.warn = _warn2.default;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("gulp-util");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 13 */,
/* 14 */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ })
/******/ ]);
});