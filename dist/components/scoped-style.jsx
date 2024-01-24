"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ScopedStyle = ({ children }) => {
    // NOTE 서버 사이드에서 바로 렌더링하는 경우 `>` 등 일부 문자에 대해 hydration 오류가 생긴다.
    const handleRef = (0, react_1.useCallback)(($) => {
        if (!$)
            return;
        $.textContent = children;
    }, [children]);
    return <style ref={handleRef} scoped/>;
};
exports.default = (0, react_1.memo)(ScopedStyle);
