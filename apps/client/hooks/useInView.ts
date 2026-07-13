import { RefObject, useEffect, useState } from "react";

export const useInView = (
  target: RefObject<Element | null>,
  options: IntersectionObserverInit & { triggerOnce?: boolean } = {},
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [observer, setObserver] = useState<IntersectionObserver | null>(null);

  useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      const intersecting = entries[0]?.isIntersecting ?? false;
      setIsIntersecting(intersecting);

      if (intersecting && options.triggerOnce) {
        observer?.disconnect();
      }
    };

    observer?.disconnect();

    if (target.current) {
      const _observer = new IntersectionObserver(callback, options);
      _observer.observe(target.current);
      setObserver(_observer);
    }

    return () => {
      observer?.disconnect();
    };
  }, [target.current, options.root, options.rootMargin, options.threshold]);

  return isIntersecting;
};
