import { _ } from './testHelpers';
import * as H from '../helpers';
import path from 'path';

describe('helpers', () => {
    describe('ParsedPath', () => {
        describe('instances', () => {
            it(_`contain all properties from a path parsed by
                 path.parse().`, () => {
                const pth = '/foo/bar/baz.qux';
                const parsedPath = new H.ParsedPath(pth);
                const pathParsedPath = path.parse(pth);

                Object.entries(pathParsedPath).forEach(([key, val]) => {
                    expect(parsedPath[key]).toEqual(val);
                });
            });

            it(_`plus the property "full" that returns the original path string
                 given to constructor.`, () => {
                const pth = '/foo/bar/baz.qux';
                const parsedPath = new H.ParsedPath(pth);
                expect(parsedPath.full).toBe(pth);
            });
        });

        it(_`has a "toString" method that returns its "full" property.`, () => {
            const pth = '/foo/bar/baz.qux';
            const parsedPath = new H.ParsedPath(pth);
            expect(parsedPath.toString()).toBe(parsedPath.full);
        });

    });

    describe('pathParse', () => {
        it(_`is a simple ParsedPath factory.`, () => {
            const pth = '/foo/bar/baz.qux';
            const parsedPathConstruct = new H.ParsedPath(pth);
            const parsedPathFact = new H.parsePath(pth);
            expect(parsedPathConstruct).toEqual(parsedPathFact);
            expect(parsedPathFact).toBeInstanceOf(H.ParsedPath);
        });
    });

    describe('warn', () => {
        it(_`logs given messages to console.warn prepended with package-specific
             info.`, () => {
            const consoleWarn = console.warn;
            console.warn = jest.fn();
            H.warn('foo', 'bar');
            expect(console.warn)
                .toHaveBeenCalledWith('[path-matching] WARNING:', 'foo', 'bar');
            console.warn = consoleWarn;
        })
    });
});
