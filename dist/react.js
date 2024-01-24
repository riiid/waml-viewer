"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.C = void 0;
// eslint-disable-next-line @jjoriping/variable-name
function C(...args) {
    return args.filter(v => v).join(' ');
}
exports.C = C;
