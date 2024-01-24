import type { FC } from "react";
import { memo, useCallback } from "react";

type Props = {
  children: string
};
const ScopedStyle:FC<Props> = ({ children }) => {
  // NOTE 서버 사이드에서 바로 렌더링하는 경우 `>` 등 일부 문자에 대해 hydration 오류가 생긴다.
  const handleRef = useCallback(
    ($:HTMLStyleElement|null) => {
      if(!$) return;
      $.textContent = children;
    },
    [ children ]
  );
  return <style ref={handleRef} scoped />;
};
export default memo(ScopedStyle);