import { Transform } from 'stream';
import { log } from 'gulp-util';
import path from 'path';
import PathMatcher from './PathMatcher';
import SimpleCache from './utils/SimpleCache';
import { toUnixSeparator } from './utils/string';

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
        // Signal to PathMatcher whether the file is a directory or not, and
        //  avoid sending '/' instead of './'.
        let pth = (toUnixSeparator(file.relative) || '.') + (isDir ? '/' : '');
        const newPth = this.pathMatcher.match(pth);
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

const pathMatcherCache = new SimpleCache(rules => new PathMatcher(rules));

const DEFAULT_OPTIONS = {
    dryRun: false,
    verbose: false,
    logUnchanged: false,
    onlyFiles: false
};

export default function gulpRestructureTree(pathMoveRules, options = {}) {
    const pathMatcher = pathMatcherCache.get(pathMoveRules);

    return new FileMoveTransform(pathMatcher,
        { ...DEFAULT_OPTIONS, ...options });
}