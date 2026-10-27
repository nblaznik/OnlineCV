import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  ChevronDown,
  FileDown,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Newspaper,
} from "lucide-react";
import cv from "./data/cv_data.json";
import CvActions from "./CvActions";
import MobileNav from "./MobileNav";
import NavRail from "./NavRail";
import PolygonCanvas from "./PolygonCanvas";
import { MOBILE_NAV_ITEMS, NAV_ITEMS, SECTION_IDS } from "./navigation";

const SKILL_LABELS = {
  prog_data: "Programming & data",
  soft_eng: "Software engineering",
  experimental: "Experimental systems",
  other: "Tools & creative",
};

const SOCIAL_ICONS = {
  github: Github,
  instagram: Instagram,
  linkedin: Linkedin,
  scholar: Newspaper,
};

function SectionHeading({ number, eyebrow, title, description }) {
  return (
    <header className="mb-8 sm:mb-10">
      <div className="mb-3 flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#8a5725]">
        <span>{number}</span>
        <span aria-hidden="true" className="h-px w-10 bg-[#8a5725]/45" />
        <span>{eyebrow}</span>
      </div>
      <h2 className="max-w-2xl text-[1.85rem] font-medium leading-[1.12] tracking-[-0.025em] text-[#0c302e] sm:text-[2.6rem]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-[#415b55] sm:text-base">
          {description}
        </p>
      )}
    </header>
  );
}

function SocialLinks({ socials, labelled = false }) {
  return (
    <div className={`flex flex-wrap ${labelled ? "gap-2.5" : "gap-3"}`}>
      {socials.map((social) => {
        const platform = social.platform.toLowerCase();
        const Icon = SOCIAL_ICONS[platform] || ArrowUpRight;

        return (
          <a
            key={`${social.platform}-${social.link}`}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.platform}
            title={social.platform}
            className={`group inline-flex items-center justify-center border border-[#0c302e]/15 bg-[#f8eed8]/70 text-[#264b45] shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-[#8a5725]/45 hover:bg-[#fbf4e5] hover:text-[#6f421b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c302e] motion-reduce:transform-none ${
              labelled ? "h-11 gap-2 rounded-full px-4 text-sm font-medium" : "size-11 rounded-full"
            }`}
          >
            <Icon aria-hidden="true" size={labelled ? 17 : 19} strokeWidth={1.7} />
            {labelled && <span>{social.platform}</span>}
          </a>
        );
      })}
    </div>
  );
}

function AccordionCard({ id, index, title, subtitle, isOpen, onToggle, children }) {
  return (
    <article
      id={id}
      className={`overflow-hidden rounded-2xl border shadow-[0_8px_28px_rgba(48,42,26,0.045)] transition-[border-color,background-color,box-shadow] [overflow-anchor:none] ${
        isOpen
          ? "border-[#8a5725]/30 bg-[#fbf3df]/95 shadow-[0_14px_36px_rgba(48,42,26,0.08)]"
          : "border-[#0c302e]/12 bg-[#f4e8cb]/75 hover:border-[#8a5725]/25 hover:bg-[#f7ecd3]/90"
      }`}
    >
      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
        className="grid w-full grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0c302e] sm:grid-cols-[2.5rem_minmax(0,1fr)_auto_auto] sm:gap-4 sm:px-5 sm:py-5"
      >
        <span className="flex size-9 items-center justify-center rounded-full border border-[#8a5725]/20 bg-[#ead6ab]/45 font-mono text-[0.68rem] font-semibold text-[#8a5725]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="min-w-0 text-[0.96rem] font-semibold leading-snug tracking-[-0.015em] text-[#163c37] sm:text-[1.05rem]">
          {title}
        </span>
        {subtitle && (
          <span className="hidden whitespace-nowrap rounded-full bg-[#0c302e]/[0.055] px-2.5 py-1 text-[0.7rem] font-medium text-[#52645f] sm:block">
            {subtitle}
          </span>
        )}
        <ChevronDown
          aria-hidden="true"
          className={`size-[18px] shrink-0 text-[#6e5a3f] transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          strokeWidth={1.6}
        />
        {subtitle && (
          <span className="col-start-2 -mt-1 text-xs font-medium text-[#67736f] sm:hidden">
            {subtitle}
          </span>
        )}
      </button>

      <div
        id={`${id}-content`}
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-[#0c302e]/10 px-5 pb-5 pt-4 sm:ml-[4.75rem] sm:px-0 sm:pb-6 sm:pr-6">
            {children}
          </div>
        </div>
      </div>
    </article>
  );
}

function ExperienceSection({ data }) {
  const [openIndex, setOpenIndex] = useState(() => {
    const hash = window.location.hash.replace("#experience-", "");
    const index = data.findIndex((_, itemIndex) => String(itemIndex) === hash);
    return index === -1 ? 0 : index;
  });
  const initialOpenIndex = useRef(openIndex);

  useEffect(() => {
    const index = initialOpenIndex.current;
    if (index === null || !window.location.hash.startsWith("#experience-")) return undefined;

    const frame = requestAnimationFrame(() => {
      document.getElementById(`experience-${index}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const toggle = (index) => {
    const next = openIndex === index ? null : index;
    setOpenIndex(next);
    window.history.replaceState(null, "", next === null ? "#experience" : `#experience-${index}`);
  };

  return (
    <section id="experience" className="section-shell">
      <div className="w-full max-w-3xl">
        <SectionHeading
          number="02"
          eyebrow="Experience"
          title="Research and engineering experience."
          description="Research, instrumentation, analysis, and software—open an entry for the details."
        />
        <div className="space-y-3">
          {data.map((experience, index) => (
            <AccordionCard
              key={experience.role}
              id={`experience-${index}`}
              index={index}
              title={experience.role}
              subtitle={experience.years}
              isOpen={openIndex === index}
              onToggle={() => toggle(index)}
            >
              <ul className="list-outside list-disc space-y-2 pl-5 text-[0.925rem] leading-relaxed text-[#3c514c] marker:text-[#a7692e] sm:text-base">
                {experience.points.map((point, pointIndex) => (
                  <li key={pointIndex} dangerouslySetInnerHTML={{ __html: point }} />
                ))}
              </ul>
            </AccordionCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function EducationSection({ data }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="education" className="section-shell">
      <div className="w-full max-w-3xl">
        <SectionHeading
          number="03"
          eyebrow="Education"
          title="Education and academic training."
          description="From broad interdisciplinary study to specialised research in quantum gases and imaging."
        />
        <div className="space-y-3">
          {data.map((education, index) => (
            <AccordionCard
              key={education.title}
              id={`education-${index}`}
              index={index}
              title={education.title}
              subtitle={education.years}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <ul className="list-outside list-disc space-y-2 pl-5 text-[0.925rem] leading-relaxed text-[#3c514c] marker:text-[#a7692e] sm:text-base">
                {education.details.map((detail, detailIndex) => (
                  <li key={detailIndex} dangerouslySetInnerHTML={{ __html: detail }} />
                ))}
              </ul>
            </AccordionCard>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const scrollRef = useRef(null);
  const navigationTargetRef = useRef(null);
  const navigationSettleTimerRef = useRef(null);
  const [activeSection, setActiveSection] = useState("lander");

  const navigateToSection = useCallback((id) => {
    const container = scrollRef.current;
    const target = document.getElementById(id);
    if (!container || !target) return;

    const containerTop = container.getBoundingClientRect().top;
    const targetTop = target.getBoundingClientRect().top - containerTop + container.scrollTop;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.clearTimeout(navigationSettleTimerRef.current);
    navigationTargetRef.current = prefersReducedMotion ? null : id;
    setActiveSection(id);
    container.scrollTo({ top: targetTop, behavior: prefersReducedMotion ? "auto" : "smooth" });
    window.history.replaceState(null, "", `#${id}`);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return undefined;

    let frame = null;
    const updateActiveSection = () => {
      if (navigationTargetRef.current) {
        window.clearTimeout(navigationSettleTimerRef.current);
        navigationSettleTimerRef.current = window.setTimeout(() => {
          navigationTargetRef.current = null;
          updateActiveSection();
        }, 140);
        return;
      }

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const marker = container.getBoundingClientRect().top + container.clientHeight * 0.42;
        let nextSection = SECTION_IDS[0];

        SECTION_IDS.forEach((id) => {
          const section = document.getElementById(id);
          if (section?.getBoundingClientRect().top <= marker) nextSection = id;
        });

        setActiveSection(nextSection);
      });
    };

    const resizeObserver = new ResizeObserver(updateActiveSection);
    resizeObserver.observe(container);
    SECTION_IDS.forEach((id) => {
      const section = document.getElementById(id);
      if (section) resizeObserver.observe(section);
    });

    container.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    updateActiveSection();

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(navigationSettleTimerRef.current);
      resizeObserver.disconnect();
      container.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    const id = window.location.hash.slice(1);
    if (!container || !SECTION_IDS.includes(id)) return undefined;

    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (!target) return;

      const containerTop = container.getBoundingClientRect().top;
      container.scrollTop = target.getBoundingClientRect().top - containerTop + container.scrollTop;
      setActiveSection(id);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#ddc490]">
      <CvActions />
      <div className="relative z-10 grid h-full w-full grid-cols-1 lg:grid-cols-[30%_70%]">
        <aside className="relative hidden min-w-0 lg:block">
          <div
            className={`h-full transition-all duration-500 ${
              activeSection !== "lander" ? "translate-x-0 opacity-100" : "pointer-events-none -translate-x-3 opacity-0"
            }`}
          >
            <NavRail active={activeSection} items={NAV_ITEMS} onNavigate={navigateToSection} />
          </div>
        </aside>

        <main ref={scrollRef} className="site-scrollbar relative h-full min-w-0 overflow-y-auto overscroll-contain pb-14 lg:pb-0">
          <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 overflow-hidden opacity-[0.27]">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.56] sm:scale-[0.7] md:scale-[0.84] lg:left-[65%] lg:scale-100">
              <PolygonCanvas scrollRef={scrollRef} />
            </div>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_72%_42%,rgba(247,237,215,0.34),transparent_42%),linear-gradient(90deg,rgba(221,196,144,0.25),rgba(239,221,181,0.1))]"
          />

          <section id="lander" className="relative flex min-h-[100dvh] items-center justify-center px-6 py-20 sm:px-10 lg:-translate-x-[15vw]">
            <div className="w-full max-w-2xl text-center">
              <p className="mb-5 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#7d5127]">
                Interactive curriculum vitae
              </p>
              <h1 className="text-4xl font-medium tracking-[-0.045em] text-[#0c302e] sm:text-6xl">
                {cv.name}
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-[1.05rem] leading-relaxed text-[#274a44] sm:text-xl sm:leading-relaxed">
                {cv.headline}
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigateToSection("experience")}
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-[#0c302e] px-6 text-sm font-semibold text-[#f8eed8] shadow-[0_12px_28px_rgba(12,48,46,0.2)] transition hover:-translate-y-0.5 hover:bg-[#17443f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c302e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#ddc490] motion-reduce:transform-none"
                >
                  Explore my work
                  <ArrowDown aria-hidden="true" size={16} />
                </button>
                <a
                  href={`${import.meta.env.BASE_URL}nejc-blaznik-cv.pdf`}
                  download="Nejc-Blaznik-CV.pdf"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-[#0c302e]/20 bg-[#f7ecd3]/65 px-6 text-sm font-semibold text-[#244840] shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-[#8a5725]/40 hover:bg-[#fbf3df] hover:text-[#6f421b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c302e] motion-reduce:transform-none"
                >
                  <FileDown aria-hidden="true" size={16} />
                  Download CV
                </a>
              </div>

              <div className="mt-8 flex justify-center">
                <SocialLinks socials={cv.contact.socials} />
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigateToSection("profile")}
              className="absolute bottom-20 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 bg-transparent px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#506a64] transition-colors hover:bg-transparent hover:text-[#0c302e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#383225] sm:bottom-16 lg:bottom-8"
              aria-label="Scroll to profile"
            >
              <span>Discover</span>
              <ArrowDown aria-hidden="true" size={16} strokeWidth={1.5} />
            </button>
          </section>

          <section id="profile" className="section-shell">
            <div className="w-full max-w-3xl">
              <SectionHeading number="01" eyebrow="Profile" title="Experimental physics, imaging, and software." />
              <div className="grid gap-5 md:grid-cols-[1.45fr_0.75fr]">
                <div className="rounded-3xl border border-[#0c302e]/12 bg-[#f8eed8]/78 p-6 shadow-[0_18px_45px_rgba(48,42,26,0.06)] backdrop-blur-sm sm:p-8">
                  <p
                    className="text-base leading-[1.8] text-[#2f4c46] sm:text-lg"
                    dangerouslySetInnerHTML={{ __html: cv.profile }}
                  />
                </div>
                <aside className="rounded-3xl border border-[#0c302e]/12 bg-[#0c302e]/[0.055] p-6 sm:p-7">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#8a5725]">Focus</p>
                  <ul className="mt-5 space-y-4 text-sm font-medium text-[#244740]">
                    {["Quantum systems", "Imaging & reconstruction", "Scientific software"].map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span aria-hidden="true" className="size-1.5 rotate-45 bg-[#a7692e]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </aside>
              </div>
            </div>
          </section>

          <ExperienceSection data={cv.experience} />
          <EducationSection data={cv.education} />

          <section id="awards" className="section-shell">
            <div className="w-full max-w-3xl">
              <SectionHeading
                number="04"
                eyebrow="Recognition"
                title="Awards and activities."
              />
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ["Poster awards", cv.awards.poster],
                  ["Activities & distinctions", cv.awards.extracurricular],
                ].map(([title, items], groupIndex) => (
                  <article key={title} className="rounded-3xl border border-[#0c302e]/12 bg-[#f7ecd3]/80 p-6 shadow-[0_14px_38px_rgba(48,42,26,0.055)] sm:p-7">
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-lg font-semibold tracking-tight text-[#143a35]">{title}</h3>
                      <span className="font-mono text-xs text-[#9a642f]">0{groupIndex + 1}</span>
                    </div>
                    <ul className="space-y-3 text-[0.925rem] leading-relaxed text-[#40534e]">
                      {items.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span aria-hidden="true" className="mt-[0.62rem] size-1.5 shrink-0 rotate-45 bg-[#a7692e]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="skills" className="section-shell">
            <div className="w-full max-w-3xl">
              <SectionHeading
                number="05"
                eyebrow="Toolkit"
                title="Technical toolkit."
                description="A practical toolkit spanning analysis, instrument control, image reconstruction, and software delivery."
              />
              <div className="grid gap-4 sm:grid-cols-2">
                {Object.entries(cv.skills).map(([key, items]) => (
                  <article key={key} className="glass-card rounded-3xl p-6">
                    <h3 className="text-lg font-semibold tracking-tight text-[#143a35]">{SKILL_LABELS[key] || key}</h3>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {items.map((item) => (
                        <span key={item} className="rounded-full border border-[#0c302e]/10 bg-[#ead7ae]/35 px-3 py-1.5 text-xs leading-relaxed text-[#3d554f]">
                          {item}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              <div className="glass-card mt-5 rounded-3xl p-6 sm:p-7">
                <h3 className="text-lg font-semibold tracking-tight text-[#143a35]">Languages</h3>
                <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                  {Object.entries(cv.languages).map(([language, level]) => (
                    <div key={language} className="flex items-baseline justify-between gap-4 border-b border-[#0c302e]/10 pb-2 text-sm">
                      <dt className="font-semibold text-[#244740]">{language}</dt>
                      <dd className="text-[#61706c]">{level}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>

          <section id="publications" className="section-shell">
            <div className="w-full max-w-3xl">
              <SectionHeading
                number="06"
                eyebrow="Selected work"
                title="Selected publications and research."
              />
              <ol className="space-y-3">
                {cv.publications.map((publication, index) => (
                  <li key={index} className="glass-card group grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 rounded-2xl p-4 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-4 sm:p-5">
                    <span className="font-mono text-xs font-semibold text-[#a26931]">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-[0.9rem] leading-relaxed text-[#3d514d] sm:text-[0.96rem]" dangerouslySetInnerHTML={{ __html: publication }} />
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section id="contact" className="section-shell">
            <div className="w-full max-w-3xl">
              <div className="relative overflow-hidden rounded-[2rem] border border-[#0c302e]/15 bg-[#f7ecd3]/88 p-7 shadow-[0_24px_60px_rgba(48,42,26,0.1)] backdrop-blur-md sm:p-12">
                <div aria-hidden="true" className="absolute -right-14 -top-20 size-56 rotate-12 bg-[#b77836]/10 [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
                <p className="relative text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#8a5725]">07 — Contact</p>
                <h2 className="relative mt-4 max-w-xl text-3xl font-medium tracking-[-0.035em] text-[#0c302e] sm:text-5xl">
                  Get in touch.
                </h2>
                <p className="relative mt-5 max-w-xl text-base leading-relaxed text-[#415a54] sm:text-lg">
                  For research, experimental systems, imaging, or scientific software collaborations, get in touch.
                </p>
                <div className="relative mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <a
                    href={`mailto:${cv.contact.email}`}
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-[#0c302e] px-5 text-sm font-semibold text-[#f8eed8] shadow-[0_12px_28px_rgba(12,48,46,0.2)] transition hover:-translate-y-0.5 hover:bg-[#17443f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c302e] focus-visible:ring-offset-2 motion-reduce:transform-none"
                  >
                    <Mail aria-hidden="true" size={17} />
                    {cv.contact.email}
                  </a>
                  <a
                    href={`${import.meta.env.BASE_URL}nejc-blaznik-cv.pdf`}
                    download="Nejc-Blaznik-CV.pdf"
                    className="inline-flex h-12 items-center gap-2 rounded-full border border-[#0c302e]/18 px-5 text-sm font-semibold text-[#274a44] transition hover:border-[#8a5725]/40 hover:bg-white/25 hover:text-[#6f421b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c302e]"
                  >
                    <FileDown aria-hidden="true" size={17} />
                    Download CV
                  </a>
                </div>
                <div className="relative mt-8 border-t border-[#0c302e]/12 pt-6">
                  <SocialLinks socials={cv.contact.socials} labelled />
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <MobileNav active={activeSection} items={MOBILE_NAV_ITEMS} onNavigate={navigateToSection} />
    </div>
  );
}
