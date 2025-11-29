import React, { useEffect, useState, useRef } from "react";

const items = [
  { id: "profile", label: "PROFILE" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "education", label: "EDUCATION" },
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

    // Disable scroll snapping during manual scroll
    container.classList.add("no-snap");

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
        // Scroll finished

        requestAnimationFrame(() => {
          isManualScrolling.current = false;

          // Re-enable snapping
          container.classList.remove("no-snap");

          updateActiveSection();
        });
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
      
      let scrollTimeout = null;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (isManualScrolling.current) return;

          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            if (entry.isIntersecting) setActive(id);
          }, 50);
        },
        { threshold: 0.5 }
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

            // 1 — Immediately activate this nav item
            setActive(id);

            const el = document.getElementById(id);
            if (!el) return;

            // 2 — Disable observer BEFORE anything happens
            isManualScrolling.current = true;

            // 3 — Start scroll on next animation frame (critical!)
            requestAnimationFrame(() => {
              smoothScrollTo(el, 10);
            });
          }}        >
          <div
            className={`transition-all duration-10 rounded-full bg-gray-400/40 group-hover:bg-white
              ${active === id
                ? "w-16 h-[2px] bg-white shadow-[0_0_9px_1px_rgba(215,255,255,0.6)]"
                : "w-10 h-[1px]"
              }
            `}
          />

          <span
            className={`text-xs tracking-[0.18em] whitespace-nowrap transform transition-all duration-10
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
