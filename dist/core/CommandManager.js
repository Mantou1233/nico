"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tiny_typed_emitter_1 = require("tiny-typed-emitter");
const discord_js_1 = require("discord.js");
class CommandManager extends tiny_typed_emitter_1.TypedEmitter {
    client;
    commands = new discord_js_1.Collection();
    constructor(client) {
        super();
        this.client = client;
    }
    register(cmd) {
        if (this.commands.get(cmd.command) !== undefined)
            throw new Error("Naming conflict!");
        this.commands.set(cmd.command, {
            disabled: false,
            hidden: false,
            from: global.loading,
            category: "Basic",
            desc: "",
            usage: `%p${cmd.command}`,
            ...cmd
        });
    }
}
exports.default = CommandManager;
//# sourceMappingURL=CommandManager.js.map