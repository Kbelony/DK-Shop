import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";

interface SkeletonImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Classes for the wrapper (size, aspect ratio, overflow, opacity...) */
  wrapperClassName?: string;
  /** Extra classes on the wrapper only until the image is loaded (e.g. an aspect ratio) */
  placeholderClassName?: string;
}

/** An image that shows a shimmering placeholder of the same size until it loads. */
export function SkeletonImage({
  wrapperClassName = "",
  placeholderClassName = "",
  className = "",
  onLoad,
  ...props
}: SkeletonImageProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth > 0) setLoaded(true);
  }, []);
  return (
    <span
      className={`relative block overflow-hidden ${wrapperClassName} ${
        loaded ? "" : placeholderClassName
      }`}
    >
      <span
        aria-hidden
        className={`img-shimmer absolute inset-0 transition-opacity duration-500 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
      />
      <img
        ref={ref}
        {...props}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        className={`${className} transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </span>
  );
}
