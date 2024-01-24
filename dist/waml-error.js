"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WAMLError extends Error {
    constructor(message, node) {
        super(message);
        this.node = node;
    }
}
exports.default = WAMLError;
