"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.argumentTransformer = void 0;
function argumentTransformer(type, origin, handler) {
    const _args = [];
    let i = 0;
    for (let { transformer, args } of handler.args || [
        {
            transformer: (or, ext) => or,
            args: []
        },
        {
            transformer: (or, ext) => ext,
            args: []
        }
    ]) {
        _args[i++] = transformer(...origin, ...args);
    }
    return _args;
}
exports.argumentTransformer = argumentTransformer;
//# sourceMappingURL=args.js.map