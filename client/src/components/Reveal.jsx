import { useEffect, useRef, useState } from "react";

// Fades its children up the first time they scroll into view.
function Reveal({ as = "div", delay = 0, className = "", children, ...rest }) {
  const Tag = as;
  const ref = useRef(null);
  // Browsers without IntersectionObserver just show the content
  const [visible, setVisible] = useState(
    () => typeof window !== "undefined" && !("IntersectionObserver" in window),
  );

  useEffect(() => {
    const node = ref.current;
    if (!node || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={delay ? { "--delay": `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
