import { Transform } from 'stream';
import { log } from 'gulp-util';
import path from 'path';

import PathMatcher from 'path-matcher';
import {
    toUnixSeparator,
    SimpleCache,
} from 'path-matcher-utils';

function mapFilename(pth, pathMatcher, isDir = false) {
    // Signal to PathMatcher whether the file is a directory or not while
    //  avoiding sending '/' instead of './'.
    pth = (toUnixSeparator(pth) || '.') + (isDir ? '/' : '');
    return pathMatcher.match(pth);
}

class FileMoveTransform extends Transform {
    constructor(pathMatcher, options) {
        super({ objectMode: true });
        this.pathMatcher = pathMatcher;
        this.options = options;
    }

    _transform(file, _encoding, callback) {
        const options = this.options;
        const isDir = file.isDirectory();

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

const pathMatcherCache = new SimpleCache();

const DEFAULT_OPTIONS = {
    dryRun: false,
    verbose: false,
    logUnchanged: false,
    onlyFiles: false,
    bypassCache: false,
    debug: false,
};

export default function gulpRestructureTree(pathMoveRules, opts = {}) {
    const options = { ...DEFAULT_OPTIONS, ...opts };

    const createPathMatcher = () =>
        new PathMatcher(pathMoveRules, { debug: options.debug })

    const pathMatcher = !options.bypassCache ?
        pathMatcherCache.get(pathMoveRules, createPathMatcher) :
        createPathMatcher();

    if (options.debug) {
        log('[DEBUG]: pathMatcher.compiledTree: ', pathMatcher.compiledTree);
    }

    return new FileMoveTransform(pathMatcher, options);
}

gulpRestructureTree.mapFilename = mapFilename;
gulpRestructureTree.PathMatcher = PathMatcher;
