(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("stream"), require("gulp-util"), require("path"), require("path-matcher"), require("path-matcher-utils/SimpleCache"), require("path-matcher-utils/string"));
	else if(typeof define === 'function' && define.amd)
		define(["stream", "gulp-util", "path", "path-matcher", "path-matcher-utils/SimpleCache", "path-matcher-utils/string"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("stream"), require("gulp-util"), require("path"), require("path-matcher"), require("path-matcher-utils/SimpleCache"), require("path-matcher-utils/string")) : factory(root["stream"], root["gulp-util"], root["path"], root["path-matcher"], root["path-matcher-utils/SimpleCache"], root["path-matcher-utils/string"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_7__) {
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

	var _pathMatcher = __webpack_require__(5);

	var _pathMatcher2 = _interopRequireDefault(_pathMatcher);

	var _SimpleCache = __webpack_require__(6);

	var _SimpleCache2 = _interopRequireDefault(_SimpleCache);

	var _string = __webpack_require__(7);

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
/***/ function(module, exports) {

	module.exports = require("path-matcher");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("path-matcher-utils/SimpleCache");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("path-matcher-utils/string");

/***/ }
/******/ ])
});
;