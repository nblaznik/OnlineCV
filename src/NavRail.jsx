import React, { useEffect, useState } from "react";

const sections = [
  "lander",
  "profile",
  "education",
  "experience",
  "awards",
  "skills",
  "publications",
  "contact"
];

export default function NavRail() {
  const [active, setActive] = useState("welcome");

  useEffect(() => {
    const observers = [];

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
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
    <div className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 flex-col gap-4 z-20">
      {sections.map(id => {
        const isActive = id === active;

        return (
          <a
            key={id}
            href={`#${id}`}
            className="group cursor-pointer"
          >
            <span className="absolute left-4 translate-y-[-50%] ml-3 opacity-0 group-hover:opacity-100 transition text-sm text-white whitespace-nowrap">
            {id.charAt(0).toUpperCase() + id.slice(1)}
            </span>
            <div
              className={[
                "transition-all duration-300 rounded-full",
                "bg-white/40 group-hover:bg-white",
                "group-hover:scale-110",
                isActive
                  ? "h-16 w-2 bg-white shadow-[0_0_18px_4px_rgba(100,200,255,0.8)]"
                  : "h-8 w-1"
              ].join(" ")}
            />
          </a>
        );
      })}
    </div>
  );
}
