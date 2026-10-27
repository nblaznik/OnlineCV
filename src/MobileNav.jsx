import {
  Award,
  BookOpenText,
  BriefcaseBusiness,
  GraduationCap,
  House,
  Mail,
  UserRound,
  Wrench,
} from "lucide-react";

const ICONS = {
  lander: House,
  profile: UserRound,
  experience: BriefcaseBusiness,
  education: GraduationCap,
  awards: Award,
  skills: Wrench,
  publications: BookOpenText,
  contact: Mail,
};

const SHORT_LABELS = {
  experience: "Work",
  education: "Edu",
  publications: "Papers",
  contact: "Mail",
};

export default function MobileNav({ active, items, onNavigate }) {
  return (
    <nav
      aria-label="CV sections"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#383225]/15 bg-[#f6ead0]/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_28px_rgba(48,42,26,0.08)] backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto flex w-full max-w-lg items-center justify-between px-0.5 py-1">
        {items.map((item) => {
          const Icon = ICONS[item.id];
          const isActive = active === item.id;

          return (
            <button
              type="button"
              key={item.id}
              aria-current={isActive ? "location" : undefined}
              aria-label={item.label}
              onClick={() => onNavigate(item.id)}
              className={`relative flex h-12 min-w-0 basis-[2.125rem] items-center justify-center overflow-hidden rounded-xl text-[0.64rem] font-medium tracking-[0.01em] transition-[flex-grow,max-width,background-color,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#0c302e]/[0.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0c302e] motion-reduce:transition-none ${
                isActive
                  ? "mx-0.5 max-w-32 grow bg-[#0c302e] px-1.5 text-[#f8eed8] shadow-sm"
                  : "max-w-[2.125rem] grow-0 px-0 text-[#54635e]"
              }`}
            >
              <Icon
                aria-hidden="true"
                className="shrink-0"
                size={18}
                strokeWidth={isActive ? 1.9 : 1.6}
              />
              <span
                aria-hidden="true"
                className={`pointer-events-none overflow-hidden whitespace-nowrap transition-[max-width,opacity,transform,margin] duration-200 ease-out motion-reduce:transition-none ${
                  isActive
                    ? "ml-1 max-w-12 translate-x-0 opacity-100"
                    : "ml-0 max-w-0 -translate-x-1 opacity-0"
                }`}
              >
                {SHORT_LABELS[item.id] ?? item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
