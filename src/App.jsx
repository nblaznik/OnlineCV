import React, { useRef, useEffect } from "react";
import cv from "./data/cv_data.json";
import PolygonCanvas from "./PolygonCanvas";
import {  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Mail, Github, Linkedin, Globe, Instagram, Newspaper } from "lucide-react";
import NavRail from "./NavRail";


export default function App() {
  const scrollRef = useRef(null);

  return (
    <div ref={scrollRef} className="relative w-screen h-screen overflow-y-scroll scroll-smooth">

      {/* BACKGROUND TRIANGLES */}
      <div className="opacity-30 
                      lg:opacity-70
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
      {/* SECTION 0 — LANDER */}
      <section id="lander" className="snap-start snap-always h-screen flex items-center justify-center px-6">
        <div className="max-w-3xl text-center md:text-left">
          <h1 className="text-6xl font-bold">Curriculum Vitae</h1>
          <h3 className="text-xl text-center font-bold">Nejc Blaznik</h3>
        </div>
      </section>

      <NavRail />


      {/* SECTION 2 — PROFILE */}
      <section id="profile" className="md:relative snap-start h-screen flex items-center justify-center px-1 max-w-xl mx-auto md:left-[-5%] lg:left-[-15%]">
        <div className="max-w-3xl text-center md:text-left">
          <h2 className="text-5xl font-semibold mb-6">Profile</h2>
          <p className="text-xl leading-relaxed:" dangerouslySetInnerHTML={{ __html: cv.profile }}></p>
        </div>
      </section>

      {/* SECTION 3 — EDUCATION */}
      <section id="education" className="md:relative snap-start h-screen flex items-center justify-center px-1 max-w-xl mx-auto md:left-[-5%] lg:left-[-15%]">
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
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4 — EXPERIENCE */}
      <section id="experience" className="md:relative snap-start h-screen flex items-center justify-center px-1 max-w-xl mx-auto md:left-[-5%] lg:left-[-15%]">
        <div className="max-w-3xl">
          <h2 className="text-5xl font-semibold mb-6">Experience</h2>

          {cv.experience.map((exp, idx) => (
            <div key={idx} className="mb-6 text-base md:text-xl">
              <p className="font-bold">
                {exp.role}{" "}
                <span className="text-gray-600">({exp.years})</span>
              </p>
              <ul className="list-disc list-inside mt-2">
                {exp.points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5 — AWARDS */}
      <section id="awards" className="md:relative snap-start h-screen flex items-center justify-center px-1 max-w-xl mx-auto md:left-[-5%] lg:left-[-15%]">
        <div className="max-w-3xl">
          <h2 className="text-5xl font-semibold mb-6">Awards and Distinctions</h2>

          <h3 className="font-semibold text-xl md:text-2xl">Best Poster Awards:</h3>
          <ul className="list-disc list-inside text-base md:text-xl mb-6">
            {cv.awards.poster.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>

          <h3 className="font-semibold text-xl md:text-2xl">National Science Awards:</h3>
          <ul className="list-disc list-inside mb-6 text-base md:text-xl">
            {Object.entries(cv.awards.national).map(([field, results], idx) => (
              <li key={idx}>
                <strong>{field}:</strong> {results.join(", ")}
              </li>
            ))}
          </ul>

          <h3 className="font-semibold  text-xl md:text-2xl">Extra-Curricular Distinctions:</h3>
          <ul className="list-disc list-inside text-base md:text-xl">
            {cv.awards.extracurricular.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* SECTION 6 — SKILLS */}
      <section id="skills" className="md:relative snap-start h-screen flex items-center justify-center px-1 max-w-xl mx-auto md:left-[-5%] lg:left-[-15%]">
        <div className="max-w-3xl">
          <h2 className="text-5xl font-semibold mb-6">Skills</h2>
          <p className="text-base md:text-xl">
            <strong>Fluent:</strong> {cv.skills.fluent.join(", ")}
          </p>
          <p className="text-base md:text-xl mt-4">
            <strong>Intermediate:</strong> {cv.skills.intermediate.join(", ")}
          </p>
          <h2 className="text-5xl font-semibold mb-6">Languages</h2>
          <ul className="list-disc list-inside text-base md:text-xl">
            {Object.entries(cv.languages).map(([lang, level], i) => (
              <li key={i}>
                <strong>{lang}:</strong> {level}
              </li>
            ))}
          </ul>
        </div>
      </section>

      

      {/* SECTION 8 — PUBLICATIONS */}
      <section id="publications" className="md:relative snap-start h-screen flex items-center justify-center px-1 max-w-xl mx-auto md:left-[-5%] lg:left-[-15%]">
        <div className="max-w-3xl">
          <h2 className="text-5xl font-semibold mb-6">Publications & Patents</h2>

          <ul className="list-disc list-inside text-xl space-y-2">
            {cv.publications.map((pub, i) => (
              <li key={i}>{pub}</li>
            ))}
          </ul>
        </div>
      </section>
      
      {/* SECTION 9 — CONTACT */}
      <section id="contact" className="md:relative snap-start h-screen flex items-center justify-center px-1 max-w-xl mx-auto md:left-[-5%] lg:left-[-15%]">
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
                  className="text-xl hover:text-blue-700 transition flex items-center"
                >
                  {s.platform.toLowerCase() === "github" && <Github size={32} />}
                  {s.platform.toLowerCase() === "linkedin" && <Linkedin size={32} />}
                  {s.platform.toLowerCase() === "instagram" && <Instagram size={32} />}
                  {s.platform.toLowerCase() === "orcid" && <Newspaper size={32} />}
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
  );
}
