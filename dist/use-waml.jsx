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
const react_1 = require("react");
const waml_1 = require("@riiid/waml");
const interaction_token_1 = __importStar(require("./interaction-token"));
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
        interactionTokenIndex: {}
    });
    const [value, setValue] = (0, react_1.useState)();
    const flatValue = (0, react_1.useMemo)(() => value ? (0, interaction_token_1.flattenAnswer)(value) : [], [value]);
    const interactionTokens = (0, react_1.useMemo)(() => {
        if ('error' in document)
            return [];
        const { metadata } = document;
        const R = [];
        const flatAnswers = metadata === null || metadata === void 0 ? void 0 : metadata.answers.map(interaction_token_1.flattenAnswer);
        for (let i = 0; i < metadata.answerFormat.interactions.length; i++) {
            const v = metadata.answerFormat.interactions[i];
            switch (v.type) {
                case waml_1.WAML.InteractionType.CHOICE_OPTION:
                case waml_1.WAML.InteractionType.BUTTON_OPTION: {
                    for (let j = 0; j < v.values.length; j++)
                        R.push(newToken(j));
                    break;
                }
                default:
                    R.push(newToken());
            }
            function newToken(index = 0) {
                return new interaction_token_1.default(v, flatAnswers.map(w => w[i]), index, flatValue[i], next => {
                    const nextInput = [...flatValue];
                    nextInput[i] = next;
                    setValue((0, interaction_token_1.unflattenAnswer)(nextInput));
                });
            }
        }
        $renderingVariables.current.interactionTokenIndex = {};
        return R;
    }, [document, flatValue]);
    const R = (0, react_1.useMemo)(() => ({
        metadata: 'error' in document ? null : document.metadata,
        commonOptions: {
            noDefaultClassName: options.noDefaultClassName || false
        },
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
        value,
        renderingVariables: $renderingVariables.current
    }), [document, interactionTokens, options, value]);
    return <context.Provider value={R}>
    {children}
  </context.Provider>;
};
exports.WAMLProvider = WAMLProvider;
