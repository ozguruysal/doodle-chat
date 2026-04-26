import { useEffect, useLayoutEffect, useRef } from "react";

interface UseResizeObserverOptions {
  ref: React.RefObject<Element | null>;
  onResize: ResizeObserverCallback;
}

export const useResizeObserver = ({
  ref,
  onResize,
}: UseResizeObserverOptions) => {
  const callbackRef = useRef(onResize);

  useLayoutEffect(() => {
    callbackRef.current = onResize;
  }, [onResize]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let frameId: number;

    const observer = new ResizeObserver((entries, obs) => {
      frameId = requestAnimationFrame(() => {
        callbackRef.current(entries, obs);
      });
    });

    observer.observe(element);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [ref]);
};
