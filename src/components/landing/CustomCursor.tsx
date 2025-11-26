import { useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [focus, setFocus] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = useMemo(
    () => ({ stiffness: 350, damping: 40, mass: 0.8 }),
    []
  );
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) return;

    const handleMove = (event: PointerEvent) => {
      setVisible(true);
      x.set(event.clientX - 12);
      y.set(event.clientY - 12);
    };
    const hide = () => setVisible(false);

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerleave", hide);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerleave", hide);
    };
  }, [x, y]);

  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) return;

    const targets = document.querySelectorAll("[data-cursor='focus']");
    const enter = () => setFocus(true);
    const leave = () => setFocus(false);

    targets.forEach((target) => {
      target.addEventListener("pointerenter", enter, { passive: true });
      target.addEventListener("pointerleave", leave, { passive: true });
    });

    return () => {
      targets.forEach((target) => {
        target.removeEventListener("pointerenter", enter);
        target.removeEventListener("pointerleave", leave);
      });
    };
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      style={{
        translateX: springX,
        translateY: springY,
      }}
      className="fixed z-[999] pointer-events-none hidden lg:block"
    >
      <span
        className={`block rounded-full border border-deep/40 bg-white/30 backdrop-blur-sm transition-all duration-300 ${
          focus ? "h-16 w-16 border-ember/80 bg-ember/20 mix-blend-multiply" : "h-6 w-6"
        }`}
      />
    </motion.div>
  );
}

