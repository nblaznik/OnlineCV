import { useCallback, useEffect, useRef, useState } from "react";
import cv from "./data/cv_data.json";
import MobileNav from "./MobileNav";
import PolygonCanvas from "./PolygonCanvas";
import { ArrowDown, ChevronDown, Github, Instagram, Linkedin, Newspaper } from "lucide-react";
import NavRail from "./NavRail";
import { MOBILE_NAV_ITEMS, NAV_ITEMS, SECTION_IDS } from "./navigation";



function AccordionCard({ id, title, subtitle, isOpen, onToggle, children }) {
  return (
    <div
      id={id}
      className={`overflow-hidden rounded-md border bg-[#f4e8cb]/90
        transition-[border-color,background-color]
        ${isOpen ? "border-[#383225]/35 bg-[#f7edd7]/95" : "border-[#383225]/15 hover:border-[#383225]/30"}
        [overflow-anchor:none]
      `}
    >
    <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
        className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition-colors hover:bg-[#8b5721]/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#383225] sm:px-5 sm:py-4"
      >
        <span className="min-w-0 text-[0.95rem] font-medium leading-snug tracking-[-0.01em] sm:text-base">
          {title}{" "}
          {subtitle && (
            <span className="ml-1 whitespace-nowrap font-normal text-[#66706a]">
              ({subtitle})
            </span>
          )}
        </span>

        <ChevronDown
          aria-hidden="true"
          className={`size-[18px] shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          strokeWidth={1.6}
        />

      </button>

      <div
        id={`${id}-content`}
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-4 pb-4 sm:px-5 sm:pb-5">{children}</div>
        </div>
      </div>
    </div>
  );
}


function ExperienceSection({ data }) {
  const [openIndex, setOpenIndex] = useState(() => {
    const hash = window.location.hash.replace("#experience-", "");
    const index = data.findIndex((_, itemIndex) => String(itemIndex) === hash);
    return index === -1 ? null : index;
  });
  const initialOpenIndex = useRef(openIndex);

  // deep-link handling
  useEffect(() => {
    const index = initialOpenIndex.current;
    if (index === null) return undefined;

    const frame = requestAnimationFrame(() => {
      document
        .getElementById(`experience-${index}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const toggle = (idx) => {
    const next = openIndex === idx ? null : idx;
    setOpenIndex(next);
    window.history.replaceState(
      null,
      "",
      next === null ? "#experience" : `#experience-${idx}`
    );
  };

  return (
    <section
      id="experience"
      className="mx-auto flex min-h-[100dvh] w-full max-w-xl items-center justify-center px-6 py-16 sm:px-8"
    >
      <div className="max-w-3xl w-full">
        <h2 className="mb-6 text-3xl font-medium tracking-tight sm:mb-7 sm:text-4xl">
          Experience
        </h2>

        <div className="space-y-2.5 sm:space-y-3">
          {data.map((exp, idx) => (
            <AccordionCard
              key={idx}
              id={`experience-${idx}`}
              title={exp.role}
              subtitle={exp.years}
              isOpen={openIndex === idx}
              onToggle={() => toggle(idx)}
            >
              <ul className="list-outside list-disc space-y-1.5 pl-5 text-[0.9375rem] leading-relaxed sm:text-base">
                {exp.points.map((p, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: p }} />
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
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section
      id="education"
      className="mx-auto flex min-h-[100dvh] w-full max-w-xl items-center justify-center px-6 py-16 sm:px-8"
    >
      <div className="max-w-3xl w-full">
        <h2 className="mb-6 text-3xl font-medium tracking-tight sm:mb-7 sm:text-4xl">
          Education
        </h2>

        <div className="space-y-2.5 sm:space-y-3">
          {data.map((edu, idx) => (
            <AccordionCard
              key={idx}
              id={`education-${idx}`}
              title={edu.title}
              subtitle={edu.years}
              isOpen={openIndex === idx}
              onToggle={() =>
                setOpenIndex(openIndex === idx ? null : idx)
              }
            >
              <ul className="list-outside list-disc space-y-1.5 pl-5 text-[0.9375rem] leading-relaxed sm:text-base">
                {edu.details.map((d, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: d }} />
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
    const targetTop =
      target.getBoundingClientRect().top - containerTop + container.scrollTop;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.clearTimeout(navigationSettleTimerRef.current);
    navigationTargetRef.current = prefersReducedMotion ? null : id;
    setActiveSection(id);
    container.scrollTo({
      top: targetTop,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
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
        const marker =
          container.getBoundingClientRect().top + container.clientHeight * 0.42;
        let nextSection = SECTION_IDS[0];

        SECTION_IDS.forEach((id) => {
          const section = document.getElementById(id);
          if (!section) return;

          const rect = section.getBoundingClientRect();
          if (rect.top <= marker) nextSection = id;
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
    if (!container || !SECTION_IDS.includes(id)) {
      return undefined;
    }

    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (!target) return;

      const containerTop = container.getBoundingClientRect().top;
      const targetTop =
        target.getBoundingClientRect().top - containerTop + container.scrollTop;
      container.scrollTop = targetTop;
      setActiveSection(id);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const showDesktopNav = activeSection !== "lander";

  return (
  <div className="relative h-[100dvh] w-full overflow-hidden">
    <div className="relative z-10 grid h-full w-full grid-cols-1 lg:grid-cols-[30%_70%]">

        {/* LEFT COLUMN ??" APPEARS ONLY AFTER PAGE 1 */}
        <div className="relative hidden min-w-0 lg:block">
        <div
          className={`
            hidden md:block transition-opacity duration-500 
            ${showDesktopNav ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
        >
          <NavRail
            active={activeSection}
            items={NAV_ITEMS}
            onNavigate={navigateToSection}
          />
        </div>
        </div>

        {/* RIGHT COLUMN ??" SCROLLABLE CV CONTENT */}
        <div
          ref={scrollRef}
          className="relative h-full min-w-0 overflow-y-auto overscroll-contain"
        >


      {/* BACKGROUND TRIANGLES */}

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-30"
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.5] sm:scale-[0.65] md:scale-[0.82] lg:left-[65%] lg:scale-100">
          <PolygonCanvas scrollRef={scrollRef} />
        </div>
      </div>


      {/* SECTION 0 ??" LANDER
      <section id="lander" className="min-h-screen  flex items-center justify-center px-6">
        <div className="max-w-3xl text-center md:text-left">
          {/* <h1 className="text-6xl text-center font-bold mb-4">Digital CV</h1> */}
          {/* <h1 className="text-4xl text-center font-bold mb-4">Nejc Blaznik</h1> */}
          {/* <h3 className="text-base text-center">(building ... )</h3> */}
        {/* </div> */}
      {/* </section> */}
      <section
        id="lander"
        className="
          relative
          min-h-[100dvh]
          flex items-center justify-center
          px-6
        "
      >
        <div
          className="
            max-w-xl
            text-center
            lg:-translate-x-[15vw]
          "
        >
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{cv.name}</h1>
          <div className="mt-6 space-y-5 text-base">
            <p>{cv.contact.email}</p>

            <div className="mt-8 flex justify-center gap-10">
              {cv.contact.socials.map((s, i) => (
                <a
                  key={i}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base md:text-xl hover:text-blue-700 transition flex items-center"
                >
                  {s.platform.toLowerCase() === "github" && <Github size={32} />}
                  {s.platform.toLowerCase() === "linkedin" && <Linkedin size={32} />}
                  {s.platform.toLowerCase() === "instagram" && <Instagram size={32} />}
                  {s.platform.toLowerCase() === "scholar" && <Newspaper size={32} />}
                </a>
              ))}
            </div>
          </div>
        </div> {/*(make it centered on mobile) */}

        <button
          type="button"
          onClick={() => navigateToSection("profile")}
          className="absolute bottom-20 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5 bg-transparent px-4 py-2 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-[#35514c] transition-colors hover:bg-transparent hover:text-[#0c302e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#383225] sm:bottom-24 lg:bottom-9"
          aria-label="Scroll to profile"
        >
          <ArrowDown aria-hidden="true" size={17} strokeWidth={1.5} />
        </button>
      </section>

      {/* SECTION 2 ??" PROFILE */}
      <section id="profile" className="relative mx-auto flex min-h-[100dvh] w-full max-w-xl items-center justify-center px-6 py-16 sm:px-8">
        <div className="max-w-3xl text-center md:text-left">
          <h2 className="mb-6 text-3xl font-medium tracking-tight sm:text-4xl">Profile</h2>
          <p className="mb-6 text-[0.95rem] leading-relaxed sm:text-base md:text-[1.05rem]" dangerouslySetInnerHTML={{ __html: cv.profile }}></p>
        </div>
      </section>


      {/* SECTION 4 ??" EXPERIENCE */}
      {/* <section id="experience" className="md:relative ml-6 mr-6  min-h-screen  flex items-center justify-center px-1 max-w-xl mx-auto  ">
        <div className="max-w-3xl">
          <h2 className="text-5xl font-semibold mb-6">Experience</h2>

            {cv.experience.map((exp, idx) => {
            const [open, setOpen] = React.useState(false);

            return (
              <div key={idx} className="mb-6 text-base md:text-xl">
                <button
                  className="font-bold cursor-pointer w-full text-left"
                  onClick={() => setOpen(!open)}
                >
                  {exp.role} <span className="text-gray-600">({exp.years})</span>
                </button>

                {open && (
                  <ul className="list-disc list-inside mt-2">
                    {exp.points.map((p, i) => (
                      <li key={i} dangerouslySetInnerHTML={{ __html: p }}></li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section> */}

      <ExperienceSection data={cv.experience} />
      <EducationSection data={cv.education} />


      {/* SECTION 3 ??" EDUCATION */}
      {/* <section id="education" className="md:relative ml-6 mr-6 min-h-screen flex items-center justify-center px-1 max-w-xl mx-auto">
        <div className="max-w-3xl text-center md:text-left">
          <h2 className="text-5xl font-semibold mb-6">Education</h2>
          {cv.education.map((item, idx) => (
            <div key={idx} className="mb-6 text-base md:text-xl">
              <p className="font-bold">
                {item.title}{" "}
                <span className="text-gray-600">({item.years})</span>
              </p>
              <ul className="list-disc list-inside mt-2">
                {item.details.map((d, i) => (
                  <li key={i} dangerouslySetInnerHTML={{__html:d}}></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section> */}

      {/* SECTION 5 ??" AWARDS */}
      <section id="awards" className="relative mx-auto flex min-h-[100dvh] w-full max-w-xl items-center justify-center px-6 py-16 sm:px-8">
        <div className="max-w-3xl">
          <h2 className="mb-6 text-3xl font-medium tracking-tight sm:text-4xl">Awards and Distinctions</h2>

          <h3 className="text-base font-medium sm:text-lg">Best Poster Awards:</h3>
          <ul className="mb-6 list-inside list-disc text-[0.95rem] leading-relaxed sm:text-base">
              {cv.awards.poster.join(", ")}
          </ul>
          
          <h3 className="text-base font-medium sm:text-lg">Extra-Curricular Distinctions:</h3>
          <ul className="list-inside list-disc text-[0.95rem] leading-relaxed sm:text-base">
            {cv.awards.extracurricular.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* SECTION 6 ??" SKILLS */}
      <section id="skills" className="relative mx-auto flex min-h-[100dvh] w-full max-w-xl items-center justify-center px-6 py-16 sm:px-8">
        <div className="max-w-3xl">
          <h2 className="mb-6 text-3xl font-medium tracking-tight sm:text-4xl">Skills</h2>
          <p className="text-[0.95rem] leading-relaxed sm:text-base">
            <strong>Programming and Data Manipulation:</strong> {cv.skills.prog_data.join(", ")}
          </p>
          <p className="mt-4 text-[0.95rem] leading-relaxed sm:text-base">
            <strong>Software Engineering:</strong> {cv.skills.soft_eng.join(", ")}
          </p>
          <p className="mt-4 text-[0.95rem] leading-relaxed sm:text-base">
            <strong>Experimental & Imaging Tools:</strong> {cv.skills.experimental.join(", ")}
          </p>
          <p className="mt-4 text-[0.95rem] leading-relaxed sm:text-base">
            <strong>Other:</strong> {cv.skills.other.join(", ")}
          </p>
          <h2 className="mb-6 mt-10 text-3xl font-medium tracking-tight sm:text-4xl">Languages</h2>
          <ul className="list-inside list-disc text-[0.95rem] leading-relaxed sm:text-base">
            {Object.entries(cv.languages).map(([lang, level], i) => (
              <li key={i}>
                <strong>{lang}:</strong> {level}
              </li>
            ))}
          </ul>
        </div>
      </section>

      

      {/* SECTION 8 ??" PUBLICATIONS */}
      <section id="publications" className="relative mx-auto flex min-h-[100dvh] w-full max-w-xl items-center justify-center px-6 py-16 sm:px-8">
        <div className="max-w-3xl">
          <h2 className="mb-6 text-3xl font-medium tracking-tight sm:text-4xl">Publications & Patents</h2>

          <ul className="list-inside list-disc space-y-2 text-[0.95rem] leading-relaxed sm:text-base">
            {cv.publications.map((pub, i) => (
              <li key={i} dangerouslySetInnerHTML={{__html:pub}}></li>
            ))}
          </ul>
        </div>
      </section>
      
      {/* SECTION 9 ??" CONTACT */}
      <section id="contact" className="relative mx-auto flex min-h-[100dvh] w-full max-w-xl items-center justify-center px-6 py-16 sm:px-8">
        <div className="max-w-3xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{cv.name}</h1>
          <div className="mt-6 space-y-5 text-base">
            <p>{cv.contact.email}</p>
            
           {/* Social Icons */}
            <div className="mt-8 flex justify-center gap-10">
              {cv.contact.socials.map((s, i) => (
                <a
                  key={i}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base md:text-xl hover:text-blue-700 transition flex items-center"
                >
                  {s.platform.toLowerCase() === "github" && <Github size={32} />}
                  {s.platform.toLowerCase() === "linkedin" && <Linkedin size={32} />}
                  {s.platform.toLowerCase() === "instagram" && <Instagram size={32} />}
                  {s.platform.toLowerCase() === "scholar" && <Newspaper size={32} />}
                </a>
              ))}
            </div>
            {/* <div>Socials:</div>
            <ul className="list-disc list-inside">
              {cv.contact.socials.map((s, i) => (
                <li key={i}>
                  <a href={s.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {s.platform}
                  </a>
                </li>
              ))}
            </ul> */}
            {/* <p><strong>Phone:</strong> {cv.contact.phone.join(" / ")}</p> # hide this for privacy
            {cv.contact.address.map((a, i) => (
              <p key={i}><strong>Address:</strong> {a}</p>
            ))} */}
          </div>
        </div>
      </section>
      
      </div>
    </div>
    <MobileNav
      active={activeSection}
      items={MOBILE_NAV_ITEMS}
      onNavigate={navigateToSection}
    />
    </div>
  );
}
