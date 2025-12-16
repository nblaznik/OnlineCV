import React, { useRef, useState, useEffect } from "react";
import cv from "./data/cv_data.json";
import PolygonCanvas from "./PolygonCanvas";
import {  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Mail, Github, Linkedin, Globe, Instagram, Newspaper } from "lucide-react";
import NavRail from "./NavRail";



function AccordionCard({ id, title, subtitle, isOpen, onToggle, children }) {
  return (
    <div
      id={id}
      className={`border border-[#383225]/20 rounded-xl bg-[#f1e4c6]
        overflow-hidden transition-shadow
        ${isOpen ? "shadow-lg" : "shadow-sm"}
        [overflow-anchor:none]
      `}
    >
    <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
        className="w-full text-left p-6 flex justify-between items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#383225]"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <span className="font-bold text-lg">
          {title}{" "}
          {subtitle && (
            <span className="text-gray-500 font-normal">
              ({subtitle})
            </span>
          )}
        </span>

        <span
          className={`
            inline-flex items-center justify-center
            w-6 h-6 text-xl origin-center
            ${isOpen ? "animate-spin-open" : "animate-spin-close"}
          `}
        >
          +
        </span>

      </button>

      <div
        id={`${id}-content`}
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
}


function ExperienceSection({ data }) {
  const [openIndex, setOpenIndex] = useState(null);

  // deep-link handling
  useEffect(() => {
    const hash = window.location.hash.replace("#experience-", "");
    const idx = data.findIndex((_, i) => String(i) === hash);
    if (idx !== -1) {
      setOpenIndex(idx);
      setTimeout(() => {
        document
          .getElementById(`experience-${idx}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [data]);

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
      className="md:relative ml-6 mr-6 min-h-screen flex items-center justify-center px-1 max-w-xl mx-auto"
    >
      <div className="max-w-3xl w-full">
        <h2 className="text-5xl font-semibold mb-10">
          Experience
        </h2>

        <div className="space-y-6">
          {data.map((exp, idx) => (
            <AccordionCard
              key={idx}
              id={`experience-${idx}`}
              title={exp.role}
              subtitle={exp.years}
              isOpen={openIndex === idx}
              onToggle={() => toggle(idx)}
            >
              <ul className="list-disc list-inside text-base md:text-lg space-y-1">
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
      className="md:relative ml-6 mr-6 min-h-screen flex items-center justify-center px-1 max-w-xl mx-auto"
    >
      <div className="max-w-3xl w-full">
        <h2 className="text-5xl font-semibold mb-10">
          Education
        </h2>

        <div className="space-y-6">
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
              <ul className="list-disc list-inside text-base md:text-lg space-y-1">
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
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const welcome = document.getElementById("lander");
    if (!welcome) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        // If welcome is fully or mostly visible ?+' hide nav
        if (entry.isIntersecting) {
          setShowNav(false);
        } else {
          setShowNav(true);
        }
      },
      { threshold: 0.6 }
    );

    obs.observe(welcome);
    return () => obs.disconnect();
  }, []);

  return (
  <div className="relative w-screen h-screen">
    <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] w-full h-full">

        {/* LEFT COLUMN ??" APPEARS ONLY AFTER PAGE 1 */}
        <div className="relative hidden lg:block">
        <div
          className={`
            hidden md:block transition-opacity duration-500 
            ${showNav ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
        >
          <NavRail scrollRef={scrollRef} />
        </div>
        </div>

        {/* RIGHT COLUMN ??" SCROLLABLE CV CONTENT */}
        <div
          ref={scrollRef}
          className="relative h-full overflow-y-scroll scroll-smooth"
        >


      {/* BACKGROUND TRIANGLES */}

      <div className="opacity-30 
                      lg:opacity-30
                      fixed
                      top-1/2
                      left-1/2
                      md:left-[65%]
                      pointer-events-none
                      -z-10
                      scale-[0.5] md:scale-100 "
                      >
      <PolygonCanvas scrollRef={scrollRef} />
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
          md:relative
          min-h-screen
          flex items-center justify-center
          px-1
        "
      >
        <div
          className="
            max-w-xl
            text-center
            lg:-translate-x-[15vw]
          "
        >
          <h1 className="text-5xl font-bold">{cv.name}</h1>
          <div className="mt-6 text-lg space-y-5">
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
        <div
          className="
            absolute top-5
            left-1/2 -translate-x-1/2     /* centered on mobile */
            md:left-auto md:translate-x-0 /* disable centering on md+ */
            md:right-5                    /* right aligned on md+ */
            text-gray-600 text-sm
          "
        >
          <p>Website currently in production, November 2025</p>
        </div>
      </section>

      {/* SECTION 2 ??" PROFILE */}
      <section id="profile" className="md:relative ml-6 mr-6  min-h-screen  flex items-center justify-center px-1 max-w-xl mx-auto  ">
        <div className="max-w-3xl text-center md:text-left">
          <h2 className="text-5xl font-semibold mb-6">Profile</h2>
          <p className="mb-6 text-base md:text-xl leading-relaxed:" dangerouslySetInnerHTML={{ __html: cv.profile }}></p>
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
      <section id="awards" className="md:relative ml-6 mr-6 min-h-screen  flex items-center justify-center px-1 max-w-xl mx-auto  ">
        <div className="max-w-3xl">
          <h2 className="text-5xl font-semibold mb-6">Awards and Distinctions</h2>

          <h3 className="font-semibold text-xl md:text-2xl">Best Poster Awards:</h3>
          <ul className="list-disc list-inside text-base md:text-xl mb-6">
              {cv.awards.poster.join(", ")}
          </ul>
          
          <h3 className="font-semibold  text-xl md:text-2xl">Extra-Curricular Distinctions:</h3>
          <ul className="list-disc list-inside text-base md:text-xl">
            {cv.awards.extracurricular.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* SECTION 6 ??" SKILLS */}
      <section id="skills" className="md:relative ml-6 mr-6 min-h-screen  flex items-center justify-center px-1 max-w-xl mx-auto ">
        <div className="max-w-3xl">
          <h2 className="text-5xl font-semibold mb-6">Skills</h2>
          <p className="text-base md:text-xl">
            <strong>Programming and Data Manipulation:</strong> {cv.skills.prog_data.join(", ")}
          </p>
          <p className="text-base md:text-xl mt-4">
            <strong>Software Engineering:</strong> {cv.skills.soft_eng.join(", ")}
          </p>
          <p className="text-base md:text-xl mt-4">
            <strong>Experimental & Imaging Tools:</strong> {cv.skills.experimental.join(", ")}
          </p>
          <p className="text-base md:text-xl mt-4">
            <strong>Other:</strong> {cv.skills.other.join(", ")}
          </p>
          <h2 className="text-5xl font-semibold mt-12 mb-6">Languages</h2>
          <ul className="list-disc list-inside text-base md:text-xl">
            {Object.entries(cv.languages).map(([lang, level], i) => (
              <li key={i}>
                <strong>{lang}:</strong> {level}
              </li>
            ))}
          </ul>
        </div>
      </section>

      

      {/* SECTION 8 ??" PUBLICATIONS */}
      <section id="publications" className="md:relative ml-6 mr-6 min-h-screen  flex items-center justify-center px-1 max-w-xl mx-auto  ">
        <div className="max-w-3xl">
          <h2 className="text-5xl font-semibold mb-6">Publications & Patents</h2>

          <ul className="list-disc list-inside text-base md:text-xl space-y-2">
            {cv.publications.map((pub, i) => (
              <li key={i} dangerouslySetInnerHTML={{__html:pub}}></li>
            ))}
          </ul>
        </div>
      </section>
      
      {/* SECTION 9 ??" CONTACT */}
      <section id="contact" className="md:relative ml-6 mr-6 min-h-screen  flex items-center justify-center px-1 max-w-xl mx-auto  ">
        <div className="max-w-3xl text-center">
          <h1 className="text-5xl font-bold">{cv.name}</h1>
          <div className="mt-6 text-lg space-y-5">
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
    </div>
  );
}
