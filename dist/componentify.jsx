"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const use_waml_1 = __importDefault(require("./use-waml"));
const react_1 = require("./react");
function componentify(Component) {
    const R = (_a) => {
        var { node } = _a, props = __rest(_a, ["node"]);
        const { commonOptions, getComponentOptions } = (0, use_waml_1.default)();
        const componentOptions = getComponentOptions(Component.displayName);
        if (!commonOptions.noDefaultClassName) {
            props.className = (0, react_1.C)(Component.displayName, props.className);
        }
        if (typeof componentOptions === "function") {
            const children = Component(Object.assign({ node }, props));
            return componentOptions({
                node,
                children: typeof children === "object" ? children === null || children === void 0 ? void 0 : children.props['children'] : null
            });
        }
        return <Component node={node} {...props} {...componentOptions}/>;
    };
    R.displayName = Component.displayName;
    return R;
}
exports.default = componentify;
