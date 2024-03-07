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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const componentify_1 = __importDefault(require("../componentify"));
const use_waml_1 = __importDefault(require("../use-waml"));
const Audio = ({ node, onPlay, onPause, onVolumeChange, ...props }) => {
    const { getURL, logInteraction } = (0, use_waml_1.default)();
    const url = (0, react_1.useMemo)(() => getURL(node.value.uri), [getURL, node.value.uri]);
    const handlePlay = (0, react_1.useCallback)(e => {
        onPlay === null || onPlay === void 0 ? void 0 : onPlay(e);
        if (e.defaultPrevented)
            return;
        const { currentTime, duration } = e.currentTarget;
        logInteraction({ type: "medium-play", url, progress: currentTime / duration });
    }, [logInteraction, onPlay, url]);
    const handlePause = (0, react_1.useCallback)(e => {
        onPause === null || onPause === void 0 ? void 0 : onPause(e);
        if (e.defaultPrevented)
            return;
        const { currentTime, duration } = e.currentTarget;
        logInteraction({ type: "medium-pause", url, progress: currentTime / duration });
    }, [logInteraction, onPause, url]);
    const handleVolumeChange = (0, react_1.useCallback)(e => {
        onVolumeChange === null || onVolumeChange === void 0 ? void 0 : onVolumeChange(e);
        if (e.defaultPrevented)
            return;
        const { volume, muted } = e.currentTarget;
        logInteraction({ type: "medium-volume-set", url, value: muted ? 0 : volume }, true);
    }, [logInteraction, onVolumeChange, url]);
    return react_1.default.createElement("audio", { title: node.value.alt, src: url, controls: true, onPlay: handlePlay, onPause: handlePause, onVolumeChange: handleVolumeChange, ...props });
};
Audio.displayName = "Audio";
exports.default = (0, componentify_1.default)(Audio);
