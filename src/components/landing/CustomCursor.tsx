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

  // Delegated: works for links and buttons that mount after the first render
  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) return;
    const onOver = (e: PointerEvent) => {
      const el = e.target as Element | null;
      setFocus(!!el?.closest?.("[data-cursor='focus']"));
    };
    window.addEventListener("pointerover", onOver, { passive: true });
    return () => window.removeEventListener("pointerover", onOver);
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      style={{
        translateX: springX,
        translateY: springY,
      }}
      className="fixed left-0 top-0 z-[999] pointer-events-none hidden lg:block"
    >
      <span
        className={`block rounded-full border border-deep/40 bg-white/30 backdrop-blur-sm transition-all duration-300 ${
          focus ? "h-16 w-16 border-ember/80 bg-ember/20 mix-blend-multiply" : "h-6 w-6"
        }`}
      />
    </motion.div>
  );
}

