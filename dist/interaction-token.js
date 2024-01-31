"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unflattenAnswer = exports.flattenAnswer = void 0;
/* eslint-disable @typescript-eslint/no-parameter-properties */
const waml_1 = require("@riiid/waml");
class InteractionToken {
    input;
    answers;
    callback;
    index;
    #interactionValue;
    answerType;
    ordered;
    get correct() {
        if (!this.answers.length)
            return undefined;
        switch (this.answerType) {
            case "SINGLE":
                return this.answers.some(v => v.value[0] === this.interactionValue);
            case "MULTIPLE":
                if (this.ordered) {
                    return this.answers.some(v => v.value[this.index] === this.interactionValue);
                }
                return this.answers.some(v => v.value.includes(this.interactionValue));
        }
    }
    get interactionValue() {
        if (this.#interactionValue === undefined) {
            // NOTE 주관식이나 버튼인 경우 여기로 옴
            return this.input?.value.join(' ') || "";
        }
        return this.#interactionValue;
    }
    get selected() {
        return this.input?.value.includes(this.interactionValue) || false;
    }
    constructor(interaction, answers, index, input, callback) {
        this.answers = answers;
        this.index = index;
        this.input = input;
        this.callback = callback;
        switch (interaction.type) {
            case waml_1.WAML.InteractionType.CHOICE_OPTION:
                if (interaction.multipleness) {
                    this.answerType = "MULTIPLE";
                    this.ordered = interaction.multipleness === "ordered";
                }
                else {
                    this.answerType = "SINGLE";
                }
                this.#interactionValue = interaction.values[index];
                break;
            case waml_1.WAML.InteractionType.BUTTON_OPTION:
                if (interaction.multipleness) {
                    this.answerType = "MULTIPLE";
                    this.ordered = interaction.multipleness === "ordered";
                }
                else {
                    this.answerType = "SINGLE";
                }
                break;
            default:
                this.answerType = "SINGLE";
        }
    }
    getAnswerText() {
        return this.answers.map(v => v.value.join(', ')).join(', ');
    }
    handleInteract(value) {
        switch (this.answerType) {
            case "SINGLE":
                this.callback?.({ type: "SINGLE", value: [value] });
                break;
            case "MULTIPLE": {
                const next = [...this.input?.value || []];
                const index = next.indexOf(value);
                if (index === -1)
                    next.push(value);
                else
                    next.splice(index, 1);
                this.callback?.({ type: "MULTIPLE", value: next, ordered: this.ordered });
                break;
            }
            default:
                throw Error(`Unhandled answerType: ${this.answerType}`);
        }
    }
    unsetInteract() {
        this.callback?.(null);
    }
}
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
    if (answer.length > 1) {
        return { type: "COMBINED", children: answer };
    }
    return answer[0];
}
exports.unflattenAnswer = unflattenAnswer;
