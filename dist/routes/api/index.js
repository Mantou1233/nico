"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var redirect_1 = __importDefault(require("./redirect"));
var router = (0, express_1.Router)();
router.get("/redirect", redirect_1.default);
router.get("/session", redirect_1.default);
router.get("/users/", redirect_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map