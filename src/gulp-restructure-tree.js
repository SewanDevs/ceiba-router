import { Transform } from 'stream'; // gulp plugin returns a stream in object mode , transform is the said stream used to perfom this
import { log } from 'gulp-util';
import path from 'path';
import PathMatcher from './PathMatcher';
import SimpleCache from './utils/SimpleCache';
import { toUnixSeparator } from './utils/string';

/**
 * This function enables the mapping of the current tree with the new one according
 * to the new rules in pathMatcher
 * the function will analyse the nature of the file compare to the rules (regexified)
 * and then act on them accordingly
 * @param  {[type]}  pth         [description]
 * @param  {[type]}  pathMatcher [description]
 * @param  {Boolean} isDir       [description]
 * @return {[type]}              [description]
 */
function mapFilename(pth, pathMatcher, isDir = false) {
    // Signal to PathMatcher whether the file is a directory or not while
    //  avoiding sending '/' instead of './'.
    pth = (toUnixSeparator(pth) || '.') + (isDir ? '/' : '');
    return pathMatcher.match(pth);
}

/**
 * the gul plugin class which enables the change of each files within the tree
 * the _transform function will open a stream read the files
 * and (re)write thm if necessary, in this case the rewriting equals a restructuring
 */
class FileMoveTransform extends Transform {
    constructor(pathMatcher, options) {
        super({ objectMode: true });
        this.pathMatcher = pathMatcher;
        this.options = options;
    }
    /**
     * the transform here will work other each file within the tree
     * @param  {[type]}   file      [description]
     * @param  {[type]}   _encoding [description]
     * @param  {Function} callback  [description]
     * @return {[type]}             [description]
     */
    _transform(file, _encoding, callback) {
        const options = this.options;
        const isDir = file.isDirectory();

        // we only want files, but this tree only has directories so no processing is needed
        if (options.onlyFiles && isDir) {
            callback(null, file);
            return;
        }
        const pth = file.relative;
        const newPth = mapFilename(pth, this.pathMatcher, isDir);
        if (newPth === null) { // Discard file
            if (options.dryRun || options.verbose) {
                log(`[restructureTree] ${pth} => [REMOVED]`);
            }
            callback();
            return;
        }

        let newFile = file.clone({ contents: false });
        // both dry run and verbose expose some logs
        if (options.dryRun || options.verbose) {
            if (pth !== newPth && !options.logUnchanged) {
                log(`[restructureTree] ${pth} => ${newPth}`);
            }
        }
        if (!options.dryRun) {
            newFile.path = path.join(newFile.base, newPth);
        }
        if (newFile.sourceMap) {
            newFile.sourceMap.newFile = newFile.relative;
        }
        callback(null, newFile);
    }
}

/** preparing the cache of the pathMatcher object */
const pathMatcherCache = new SimpleCache(rules => new PathMatcher(rules));

const DEFAULT_OPTIONS = {
    dryRun: false,
    verbose: false,
    logUnchanged: false,
    onlyFiles: false,
    bypassCache: false,
};

/**
 * the exposed gulp function
 * @param  {[type]} pathMoveRules [description]
 * @param  {Object} options       [description]
 * @return {[type]}               [description]
 */
export default function gulpRestructureTree(pathMoveRules, options = {}) {
    options = { ...DEFAULT_OPTIONS, ...options };

    const pathMatcher = !options.bypassCache ?
        pathMatcherCache.get(pathMoveRules) :
        new PathMatcher(pathMoveRules);

    return new FileMoveTransform(pathMatcher, options);
}

gulpRestructureTree.mapFilename = mapFilename;
gulpRestructureTree.PathMatcher = PathMatcher;
