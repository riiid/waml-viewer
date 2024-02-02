"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _InteractionToken_interactionValue;
Object.defineProperty(exports, "__esModule", { value: true });
exports.unflattenAnswer = exports.flattenAnswer = void 0;
/* eslint-disable @typescript-eslint/no-parameter-properties */
const waml_1 = require("@riiid/waml");
var InteractionAnswerType;
(function (InteractionAnswerType) {
    InteractionAnswerType[InteractionAnswerType["SINGLE"] = 0] = "SINGLE";
    InteractionAnswerType[InteractionAnswerType["MULTIPLE"] = 1] = "MULTIPLE";
})(InteractionAnswerType || (InteractionAnswerType = {}));
class InteractionToken {
    get correct() {
        if (!this.answers.length)
            return undefined;
        switch (this.answerType) {
            case InteractionAnswerType.SINGLE:
                return this.answers.some(v => v.value[0] === this.interactionValue);
            case InteractionAnswerType.MULTIPLE:
                if (this.ordered) {
                    return this.answers.some(v => v.value[this.index] === this.interactionValue);
                }
                return this.answers.some(v => v.value.includes(this.interactionValue));
            default:
                throw Error(`Unhandled answerType: ${this.answerType}`);
        }
    }
    get interactionValue() {
        var _a;
        if (__classPrivateFieldGet(this, _InteractionToken_interactionValue, "f") === undefined) {
            // NOTE 주관식이나 버튼인 경우 여기로 옴
            return ((_a = this.input) === null || _a === void 0 ? void 0 : _a.value.join(' ')) || "";
        }
        return __classPrivateFieldGet(this, _InteractionToken_interactionValue, "f");
    }
    get selected() {
        var _a;
        return ((_a = this.input) === null || _a === void 0 ? void 0 : _a.value.includes(this.interactionValue)) || false;
    }
    constructor(interaction, answers, index, input, callback) {
        _InteractionToken_interactionValue.set(this, void 0);
        this.answers = answers;
        this.index = index;
        this.input = input;
        this.callback = callback;
        switch (interaction.type) {
            case waml_1.WAML.InteractionType.CHOICE_OPTION:
                if (interaction.multipleness) {
                    this.answerType = InteractionAnswerType.MULTIPLE;
                    this.ordered = interaction.multipleness === "ordered";
                }
                else {
                    this.answerType = InteractionAnswerType.SINGLE;
                }
                __classPrivateFieldSet(this, _InteractionToken_interactionValue, interaction.values[index], "f");
                break;
            case waml_1.WAML.InteractionType.BUTTON_OPTION:
                if (interaction.multipleness) {
                    this.answerType = InteractionAnswerType.MULTIPLE;
                    this.ordered = interaction.multipleness === "ordered";
                }
                else {
                    this.answerType = InteractionAnswerType.SINGLE;
                }
                break;
            case waml_1.WAML.InteractionType.PAIRING_NET:
                throw Error("InteractionToken does not support PAIRING_NET");
            default:
                this.answerType = InteractionAnswerType.SINGLE;
        }
    }
    handleInteract(value) {
        var _a, _b, _c;
        switch (this.answerType) {
            case InteractionAnswerType.SINGLE:
                (_a = this.callback) === null || _a === void 0 ? void 0 : _a.call(this, { type: "SINGLE", value: [value] });
                break;
            case InteractionAnswerType.MULTIPLE:
                {
                    const next = [...((_b = this.input) === null || _b === void 0 ? void 0 : _b.value) || []];
                    const index = next.indexOf(value);
                    if (index === -1)
                        next.push(value);
                    else
                        next.splice(index, 1);
                    (_c = this.callback) === null || _c === void 0 ? void 0 : _c.call(this, { type: "MULTIPLE", value: next, ordered: this.ordered });
                }
                break;
            default:
                throw Error(`Unhandled answerType: ${this.answerType}`);
        }
    }
    unsetInteract() {
        var _a;
        (_a = this.callback) === null || _a === void 0 ? void 0 : _a.call(this, null);
    }
}
_InteractionToken_interactionValue = new WeakMap();
exports.default = InteractionToken;
function flattenAnswer(answer) {
    switch (answer.type) {
        case "SINGLE":
        case "MULTIPLE":
            return [answer];
        case "COMBINED":
            return answer.children;
    }
}
exports.flattenAnswer = flattenAnswer;
function unflattenAnswer(answer) {
    for (const v of answer) {
        if (v.type === "MULTIPLE" && !v.ordered) {
            v.value.sort((a, b) => a.localeCompare(b));
        }
    }
    if (answer.length > 1) {
        return { type: "COMBINED", children: answer };
    }
    return answer[0];
}
exports.unflattenAnswer = unflattenAnswer;
