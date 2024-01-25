"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOT_YET_IMPLEMENTED = void 0;
class WAMLError extends Error {
    constructor(message, node) {
        super(message);
        this.node = node;
    }
}
exports.default = WAMLError;
exports.NOT_YET_IMPLEMENTED = new WAMLError("Not yet implemented");
