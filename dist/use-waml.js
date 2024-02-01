"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WAMLProvider = void 0;
const react_1 = __importStar(require("react"));
const waml_1 = require("@riiid/waml");
const interaction_token_js_1 = __importStar(require("./interaction-token.js"));
const context = (0, react_1.createContext)(null);
const useWAML = (invokingInteractionToken) => {
    const id = (0, react_1.useId)();
    const R = (0, react_1.useContext)(context);
    if (invokingInteractionToken) {
        R.interactionToken = R.invokeInteractionToken(id);
    }
    return R;
};
exports.default = useWAML;
const WAMLProvider = ({ document, options, children }) => {
    const $renderingVariables = (0, react_1.useRef)({
        pendingClasses: [],
        interactionTokenIndex: {},
        buttonOptionUsed: {},
        namedInteractionTokens: {},
        pairingOptionDots: {}
    });
    const [value, setValue] = (0, react_1.useState)();
    const [draggingObject, setDraggingObject] = (0, react_1.useState)(null);
    const flatValue = (0, react_1.useMemo)(() => value ? (0, interaction_token_js_1.flattenAnswer)(value) : [], [value]);
    const buttonOptionState = (0, react_1.useMemo)(() => {
        var _a, _b;
        if ('error' in document)
            return {};
        const R = {};
        for (const v of document.metadata.answerFormat.interactions) {
            if (v.type !== waml_1.WAML.InteractionType.BUTTON_OPTION)
                continue;
            for (const w of ((_a = flatValue[v.index]) === null || _a === void 0 ? void 0 : _a.value) || []) {
                (_b = R[w]) !== null && _b !== void 0 ? _b : (R[w] = []);
                R[w].push(v.index);
            }
        }
        return R;
    }, [document, flatValue]);
    const interactionTokens = (0, react_1.useMemo)(() => {
        if ('error' in document)
            return [];
        const { metadata } = document;
        const R = [];
        const flatAnswers = metadata === null || metadata === void 0 ? void 0 : metadata.answers.map(interaction_token_js_1.flattenAnswer);
        for (const v of metadata.answerFormat.interactions) {
            switch (v.type) {
                case waml_1.WAML.InteractionType.CHOICE_OPTION:
                    for (let j = 0; j < v.values.length; j++)
                        R.push(newToken(j));
                    break;
                case waml_1.WAML.InteractionType.PAIRING_NET:
                    continue;
                default:
                    R.push(newToken());
            }
            function newToken(index = 0) {
                return new interaction_token_js_1.default(v, flatAnswers.map(w => w[v.index]), index, flatValue[v.index], next => {
                    const nextInput = [...flatValue];
                    nextInput[v.index] = next;
                    setValue((0, interaction_token_js_1.unflattenAnswer)(nextInput));
                });
            }
        }
        $renderingVariables.current.interactionTokenIndex = {};
        return R;
    }, [document, flatValue]);
    const pairing = (0, react_1.useMemo)(() => {
        if ('error' in document)
            return {
                pairedVertices: {},
                getDotRefs: () => ({ refInbound: null, refOutbound: null }),
                getNetIndexByEdge: () => [-1, null]
            };
        const { metadata } = document;
        const pairedVertices = {};
        for (const v of metadata.answerFormat.interactions) {
            if (v.type !== waml_1.WAML.InteractionType.PAIRING_NET)
                continue;
            const item = flatValue[v.index];
            if (!item)
                continue;
            for (const w of item.value) {
                const [from, to] = w.split('→');
                pairedVertices[from] || (pairedVertices[from] = []);
                pairedVertices[to] || (pairedVertices[to] = []);
                pairedVertices[from].push({ netIndex: v.index, to });
                pairedVertices[to].push({ netIndex: v.index, from });
            }
        }
        return {
            pairedVertices,
            getDotRefs: node => {
                var _a;
                var _b, _c;
                (_a = (_b = $renderingVariables.current.pairingOptionDots)[_c = node.cell.value]) !== null && _a !== void 0 ? _a : (_b[_c] = [null, null]);
                return {
                    refInbound: $ => {
                        $renderingVariables.current.pairingOptionDots[node.cell.value][0] = $;
                    },
                    refOutbound: $ => {
                        $renderingVariables.current.pairingOptionDots[node.cell.value][1] = $;
                    }
                };
            },
            getNetIndexByEdge: (from, to) => {
                let reversed = false;
                const index = metadata.answerFormat.interactions.findIndex(v => {
                    if (v.type !== waml_1.WAML.InteractionType.PAIRING_NET)
                        return false;
                    if (v.fromValues.includes(from)) {
                        reversed = false;
                        return v.toValues.includes(to);
                    }
                    if (v.toValues.includes(from)) {
                        reversed = true;
                        return v.fromValues.includes(to);
                    }
                    return false;
                });
                return [index, reversed ? `${to}→${from}` : `${from}→${to}`];
            }
        };
    }, [document, flatValue]);
    const R = (0, react_1.useMemo)(() => ({
        checkButtonOptionUsed: node => {
            var _a, _b;
            // 같은 value의 두 노드 중 한 노드만 답안으로 선택된 경우 먼저 등장한 노드부터 사용된 것으로 처리한다.
            const usedNodes = (_a = $renderingVariables.current.buttonOptionUsed)[_b = node.value] || (_a[_b] = []);
            let sequence = usedNodes.indexOf(node.id);
            if (sequence === -1)
                sequence = usedNodes.push(node.id) - 1;
            return node.value in buttonOptionState && buttonOptionState[node.value].length > sequence;
        },
        commonOptions: {
            noDefaultClassName: options.noDefaultClassName || false
        },
        draggingObject,
        getComponentOptions: type => options[type],
        getURL: options.uriResolver || (uri => uri),
        interactionToken: null,
        invokeInteractionToken: id => {
            let index = $renderingVariables.current.interactionTokenIndex[id];
            if (index === undefined) {
                index = Object.keys($renderingVariables.current.interactionTokenIndex).length;
                $renderingVariables.current.interactionTokenIndex[id] = index;
            }
            const r = interactionTokens[index];
            if (!r) {
                throw Error(`Unexpected interaction token index: ${index}`);
            }
            return r;
        },
        metadata: 'error' in document ? null : document.metadata,
        pairing,
        renderingVariables: $renderingVariables.current,
        setDraggingObject,
        setFlattenValue: runner => {
            const r = runner(flatValue, 'error' in document ? null : document.metadata.answerFormat.interactions);
            if (r === false)
                return;
            setValue((0, interaction_token_js_1.unflattenAnswer)(r));
        },
        value
    }), [buttonOptionState, document, draggingObject, flatValue, interactionTokens, options, pairing, value]);
    return react_1.default.createElement(context.Provider, { value: R }, children);
};
exports.WAMLProvider = WAMLProvider;
