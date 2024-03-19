import type { WAML } from "@riiid/waml";
import { WAMLDocument } from "@riiid/waml";
import type { FC, HTMLAttributes } from "react";
import type { ASTMiddleware, WAMLAction, WAMLUserInteraction, WAMLViewerOptions } from "./types";
export interface WAMLViewerProps extends Omit<HTMLAttributes<HTMLElement>, 'defaultValue' | 'onChange'> {
    waml: string | WAMLDocument;
    middlewares?: ASTMiddleware[];
    options?: WAMLViewerOptions;
    bare?: boolean;
    defaultValue?: WAML.Answer;
    value?: WAML.Answer;
    onChange?(value: WAML.Answer): void;
    onInteract?(e: WAMLUserInteraction): void;
    /**
     * 특정 조건에 의해 액션 스크립트가 실행될 때 호출되는 이벤트 핸들러.
     *
     * 이 함수가 바뀔 때마다 `onLoad` 조건이 성립되기 때문에
     * 이 함수를 `useCallback` 등으로 메모이제이션하는 것이 권장됩니다.
     *
     * @param e 실행되는 액션 스크립트 객체.
     */
    onKnobAction?(e: WAMLAction): void;
}
declare const WAMLViewer: FC<WAMLViewerProps>;
export default WAMLViewer;
export * from "./types";
