export default function NavRail({ active, items, onNavigate }) {
  return (
    <nav
      aria-label="CV sections"
      className="absolute left-8 top-1/2 flex -translate-y-1/2 select-none flex-col gap-6"
    >
      <div
        aria-hidden="true"
        className="absolute left-[-20px] top-[-80px] h-[180%] w-px bg-white/10"
      />

      {items.map(({ id, label }) => (
        <button
          type="button"
          key={id}
          aria-current={active === id ? "location" : undefined}
          className="group flex items-center gap-4 border-0 bg-transparent p-0 text-left hover:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          onClick={() => onNavigate(id)}
        >
          <span
            aria-hidden="true"
            className={`rounded-full bg-gray-400/40 transition-all duration-200 group-hover:bg-white ${
              active === id
                ? "h-0.5 w-16 bg-white shadow-[0_0_9px_1px_rgba(215,255,255,0.6)]"
                : "h-px w-10"
            }`}
          />

          <span
            className={`whitespace-nowrap text-xs tracking-[0.18em] transition-all duration-200 ${
              active === id
                ? "translate-x-0 text-white"
                : "text-gray-400 group-hover:translate-x-1 group-hover:text-gray-200"
            }`}
          >
            {label.toUpperCase()}
          </span>
        </button>
      ))}
    </nav>
  );
}
