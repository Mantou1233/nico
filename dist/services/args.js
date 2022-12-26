"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.argumentTransformer = void 0;
function argumentTransformer(type, origin, handler) {
    if (!handler.args)
        return origin;
    const _args = [];
    let i = 0;
    for (let { transformer, args } of handler.args) {
        _args[i++] = transformer(...origin, ...args);
    }
    return _args;
}
exports.argumentTransformer = argumentTransformer;
//# sourceMappingURL=args.js.map