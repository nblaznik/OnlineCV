import React, { useEffect, useState } from "react";

const items = [
  { id: "profile", label: "PROFILE" },
  { id: "education", label: "EDUCATION" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "awards", label: "AWARDS" },
  { id: "skills", label: "SKILLS" },
  { id: "publications", label: "PUBLICATIONS" },
  { id: "contact", label: "CONTACT" },
];

export default function NavRail({ scrollRef }) {
  const [active, setActive] = useState("profile");

  // Custom smooth scroll for a scroll container
  function smoothScrollTo(element, duration = 900) {
    const container = scrollRef.current;
    if (!container) return;

    const start = container.scrollTop;
    const target = element.offsetTop;
    const diff = target - start;

    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;

      const time = timestamp - startTime;
      const progress = Math.min(time / duration, 1);

      // Ease-in-out cubic
      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      container.scrollTop = start + diff * eased;

      if (time < duration) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }
  // Track active section
  useEffect(() => {
    const observers = [];

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { threshold: 0.992 }
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 select-none">

      {/* Vertical line */}
      <div className="absolute left-[-20px] top-[-80px] h-[180%] w-[1px] bg-white/10"></div>

      {items.map(({ id, label }) => {
        const isActive = id === active;

        return (
          <div
            key={id}
            className="group flex items-center gap-4 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();

              const el = document.getElementById(id);
              if (el) smoothScrollTo(el, 10);
            }}
          >

            {/* LINE */}
            <div
              className={[
                "transition-all duration-300 rounded-full",
                "bg-gray-400/40 group-hover:bg-white",
                isActive
                  ? "w-16 h-[2px] bg-white shadow-[0_0_6px_2px_rgba(255,255,255,0.6)]"
                  : "w-8 h-[1px]"
              ].join(" ")}
            />

            {/* LABEL — slide-in animation */}
            <span
              className={[
                "text-xs tracking-[0.18em] whitespace-nowrap",
                "transition-all duration-300 transform",
                isActive
                  ? "text-white translate-x-0"
                  : "text-gray-400 group-hover:text-gray-200 group-hover:translate-x-1"
              ].join(" ")}
            >
              {label}
            </span>

          </div>
        );
      })}
    </div>
  );
}
