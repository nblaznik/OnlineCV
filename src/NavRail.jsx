export default function NavRail({ active, items, onNavigate }) {
  return (
    <nav
      aria-label="CV sections"
      className="absolute left-8 top-1/2 flex -translate-y-1/2 select-none flex-col gap-5 xl:left-12"
    >
      <div
        aria-hidden="true"
        className="absolute left-[-20px] top-[-80px] h-[180%] w-px bg-[#0c302e]/10"
      />

      {items.map(({ id, label }) => (
        <button
          type="button"
          key={id}
          aria-current={active === id ? "location" : undefined}
          className="group flex items-center gap-4 border-0 bg-transparent p-0 text-left hover:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c302e]"
          onClick={() => onNavigate(id)}
        >
          <span
            aria-hidden="true"
            className={`rounded-full bg-[#0c302e]/20 transition-all duration-200 group-hover:bg-[#8a5725]/70 ${
              active === id
                ? "h-0.5 w-16 bg-[#0c302e] shadow-[0_0_10px_1px_rgba(12,48,46,0.18)]"
                : "h-px w-10"
            }`}
          />

          <span
            className={`whitespace-nowrap text-xs tracking-[0.18em] transition-all duration-200 ${
              active === id
                ? "translate-x-0 font-semibold text-[#0c302e]"
                : "text-[#5f6c68] group-hover:translate-x-1 group-hover:text-[#6f421b]"
            }`}
          >
            {label.toUpperCase()}
          </span>
        </button>
      ))}
    </nav>
  );
}
