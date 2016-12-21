const DEST_PARAMS = [
    { test: /^d(ir(ectory)?)?$/, name: 'dir' },
    { test: /^f(ile)?$/, name: 'file' },
    { test: /.*/, name: null },
];

/**
 * @param {string|undefined} val
 * @param {*} def - Default value, if param has no specified value
 * @returns {string|boolean|int}
 */
function parseParamValue(val, def) {
    if (!val) {
        return def;
    }
    if (val === 'true') { return true; }
    else if (val === 'false') { return false; }
    else {
        const intParsed = parseInt(val);
        if (!isNaN(intParsed) && intParsed.toString().length === val.length) {
            return intParsed;
        } else {
            return val;
        }
    }
}

export function parseDestParameters(pth) {
    const paramsMatch = pth.match(/\?[^\/]*$/);
    if (!paramsMatch) {
        return {};
    }
    const params = {};
    paramsMatch[0].substr(1).split('&')
        .map(p => p.match(/([^=]*)(?:=(.*))?/))
        .map(([, key, val]) => ({
            param: DEST_PARAMS.find(d => d.test.test(key)).name,
            value: val
        }))
        .filter(a => a.param)
        .forEach(({ param, value }) => {
            params[param] = parseParamValue(value, true);
        });
    return params;
}

export function removeDestParameters(pth) {
    return pth.replace(/\?.+/, '');
}