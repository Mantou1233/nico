"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
class Parser {
    Boolean() {
        return true;
    }
    Next(args, i) {
        return !args[i + 1].startsWith("-") ? args[i + 1] : undefined;
    }
}
exports.Parser = Parser;
exports.default = new Parser();
//# sourceMappingURL=parsers.js.map