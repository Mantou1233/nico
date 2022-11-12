"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class Manager {
    nowLoading = -1;
    client;
    commands = new discord_js_1.Collection();
    interactions = [];
    constructor(client) {
        this.client = client;
    }
    register(ctx) {
        if (ctx.type == "command" || !ctx.type) {
            delete ctx["type"];
            if (this.commands.has(ctx.command))
                throw new Error("Naming conflict!");
            this.commands.set(ctx.command, {
                disabled: false,
                hidden: false,
                from: this.nowLoading,
                category: "Basic",
                desc: "",
                usage: `%p${ctx.command}`,
                ...ctx
            });
        }
        else {
            this.interactions.push({
                type: "none",
                from: this.nowLoading,
                ...ctx
            });
        }
    }
}
exports.default = Manager;
//# sourceMappingURL=Manager.js.map