import React, { useEffect, useState, useRef } from "react";

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
  const isManualScrolling = useRef(false);

  // ------ NEW: compute current visible section ------
  function updateActiveSection() {
    const container = scrollRef.current;
    if (!container) return;

    let bestSection = null;
    let bestVisibility = 0;

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      const visible = Math.max(
        0,
        Math.min(rect.bottom, vh) - Math.max(rect.top, 0)
      );

      if (visible > bestVisibility) {
        bestVisibility = visible;
        bestSection = id;
      }
    });

    if (bestSection) setActive(bestSection);
  }

  function smoothScrollTo(element, duration = 900) {
    const container = scrollRef.current;
    if (!container) return;

    const target = element.offsetTop;
    const start = container.scrollTop;
    const diff = target - start;

    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      container.scrollTop = start + diff * eased;

      if (elapsed < duration) {
        requestAnimationFrame(step);
      } else {
        isManualScrolling.current = false;

        // ------- CRUCIAL: update active section AFTER landing -------
        updateActiveSection();
      }
    }

    isManualScrolling.current = true;
    requestAnimationFrame(step);
  }

  useEffect(() => {
    const observers = [];

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (isManualScrolling.current) return;

          if (entry.isIntersecting) setActive(id);
        },
        { threshold: 0.6 }
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 select-none">

      <div className="absolute left-[-20px] top-[-80px] h-[180%] w-[1px] bg-white/10"></div>

      {items.map(({ id, label }) => (
        <div
          key={id}
          className="group flex items-center gap-4 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            setActive(id); // immediate update on click
            const el = document.getElementById(id);
            if (el) smoothScrollTo(el, 900);
          }}
        >
          <div
            className={`transition-all duration-300 rounded-full bg-gray-400/40 group-hover:bg-white
              ${active === id
                ? "w-16 h-[2px] bg-white shadow-[0_0_6px_2px_rgba(255,255,255,0.6)]"
                : "w-8 h-[1px]"
              }
            `}
          />

          <span
            className={`text-xs tracking-[0.18em] whitespace-nowrap transform transition-all duration-300
              ${active === id
                ? "text-white translate-x-0"
                : "text-gray-400 group-hover:text-gray-200 group-hover:translate-x-1"
              }
            `}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
