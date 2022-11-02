"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var url_1 = __importDefault(require("url"));
var axios_1 = __importDefault(require("axios"));
var _a = process.env, DISCORD_OAUTH_CLIENT_ID = _a.DISCORD_OAUTH_CLIENT_ID, DISCORD_OAUTH_SECRET = _a.DISCORD_OAUTH_SECRET, DISCORD_REDIRECT_URL = _a.DISCORD_REDIRECT_URL;
exports.default = (function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var code, formData, response, _a, access_token, refresh_token, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                code = req.query.code;
                if (!code) return [3 /*break*/, 4];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                formData = new url_1.default.URLSearchParams({
                    client_id: DISCORD_OAUTH_CLIENT_ID,
                    client_secret: DISCORD_OAUTH_SECRET,
                    grant_type: 'authorization_code',
                    code: code.toString(),
                    redirect_uri: DISCORD_REDIRECT_URL,
                });
                return [4 /*yield*/, axios_1.default.post('https://discord.com/api/v10/oauth2/token', formData.toString(), {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    })];
            case 2:
                response = _b.sent();
                _a = response.data, access_token = _a.access_token, refresh_token = _a.refresh_token;
                console.log(access_token, refresh_token);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _b.sent();
                console.log(err_1);
                res.status(400);
                return [3 /*break*/, 4];
            case 4:
                res.status(404);
                res.json({ error: 'code is missing.' });
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=redirect.js.map