"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
Object.defineProperties(discord_js_1.EmbedBuilder.prototype, {
    setConfig: {
        value: function (member, authorText, footerText) {
            return this.setColor(parseInt(i18n.globe.color, 16));
        },
        enumerable: false
    },
    addField: {
        value: function (name, value, inline = false) {
            return this.addFields({
                name,
                value,
                inline
            });
        },
        enumerable: false
    }
});
//# sourceMappingURL=djsAddition.js.map