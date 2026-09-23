import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Start each new page at the top, or at the #section the link points to.
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const target = hash && document.getElementById(hash.slice(1));
    if (target) target.scrollIntoView({ behavior: "smooth" });
    else window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;
