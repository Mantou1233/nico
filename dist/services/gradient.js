"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hex2RGB = exports.RGB2hex = exports.Gradient = void 0;
/**
 * JavaScript implementation of HexUtils Gradients from RoseGarden.
 * https://github.com/Rosewood-Development/RoseGarden/blob/master/src/main/java/dev/rosewood/rosegarden/utils/HexUtils.java#L358
 */
class Gradient {
    colors;
    gradients;
    steps;
    step;
    constructor(colors, numSteps) {
        this.colors = colors;
        this.gradients = [];
        this.steps = numSteps - 1;
        this.step = 0;
        const increment = this.steps / (colors.length - 1);
        for (let i = 0; i < colors.length - 1; i++)
            this.gradients.push(new TwoStopGradient(colors[i], colors[i + 1], increment * i, increment * (i + 1)));
    }
    /* Gets the next color in the gradient sequence as an array of 3 numbers: [r, g, b] */
    next() {
        if (this.steps <= 1)
            return this.colors[0];
        const adjustedStep = Math.round(Math.abs(((2 *
            Math.asin(Math.sin(this.step * (Math.PI / (2 * this.steps))))) /
            Math.PI) *
            this.steps));
        let color;
        if (this.gradients.length < 2) {
            color = this.gradients[0].colorAt(adjustedStep);
        }
        else {
            const segment = this.steps / this.gradients.length;
            const index = Math.min(Math.floor(adjustedStep / segment), this.gradients.length - 1);
            color = this.gradients[index].colorAt(adjustedStep);
        }
        this.step++;
        return color;
    }
}
exports.Gradient = Gradient;
class TwoStopGradient {
    startColor;
    endColor;
    lowerRange;
    upperRange;
    constructor(startColor, endColor, lowerRange, upperRange) {
        this.startColor = startColor;
        this.endColor = endColor;
        this.lowerRange = lowerRange;
        this.upperRange = upperRange;
    }
    colorAt(step) {
        return [
            this.calculateHexPiece(step, this.startColor[0], this.endColor[0]),
            this.calculateHexPiece(step, this.startColor[1], this.endColor[1]),
            this.calculateHexPiece(step, this.startColor[2], this.endColor[2])
        ];
    }
    calculateHexPiece(step, channelStart, channelEnd) {
        const range = this.upperRange - this.lowerRange;
        const interval = (channelEnd - channelStart) / range;
        return Math.round(interval * (step - this.lowerRange) + channelStart);
    }
}
const RGB2hex = (r, g, b) => "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
exports.RGB2hex = RGB2hex;
const hex2RGB = (hex) => hex
    .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => "#" + r + r + g + g + b + b)
    .substring(1)
    .match(/.{2}/g)
    .map(x => parseInt(x, 16));
exports.hex2RGB = hex2RGB;
//# sourceMappingURL=gradient.js.map