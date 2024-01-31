"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIntersection = void 0;
function getIntersection(a, b) {
    const table = a.reduce((pv, v) => {
        pv[v] = true;
        return pv;
    }, {});
    return b.filter(v => v in table);
}
exports.getIntersection = getIntersection;
