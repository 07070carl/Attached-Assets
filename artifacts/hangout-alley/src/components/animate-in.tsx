import { useEffect, useRef, useState } from "react";

export type AnimationType =
  | "fade-up"
  | "fade-in"
  | "slide-left"
  | "slide-right"
  | "scale-in"
  | "blur-in"
  | "count";

const keyframeMap: Record<AnimationType, string> = {
  "fade-up":    "ha-fade-up",
  "fade-in":    "ha-fade-in",
  "slide-left": "ha-slide-left",
  "slide-right":"ha-slide-right",
  "scale-in":   "ha-scale-in",
  "blur-in":    "ha-blur-in",
  "count":      "ha-count",
};

interface AnimateInProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
  easing?: string;
}

export function AnimateIn({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 750,
  className = "",
  threshold = 0.1,
  easing = "cubic-bezier(0.16, 1, 0.3, 1)",
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? undefined : 0,
        animation: visible
          ? `${keyframeMap[animation]} ${duration}ms ${easing} ${delay}ms both`
          : "none",
      }}
    >
      {children}
    </div>
  );
}
