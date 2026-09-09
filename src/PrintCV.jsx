import { useEffect } from "react";
import { ArrowLeft, Printer } from "lucide-react";
import "./print.css";

const SKILL_LABELS = {
  prog_data: "Programming & data",
  soft_eng: "Software engineering",
  experimental: "Experimental systems",
  other: "Tools & creative",
};

function printText(value) {
  return value.replace(/[‐‑‒–—−]/g, "-");
}

function SectionTitle({ children }) {
  return (
    <h2 className="pdf-section-title">
      <span>{children}</span>
    </h2>
  );
}

function ExperienceEntry({ entry }) {
  return (
    <article className="pdf-entry">
      <div className="pdf-entry-heading">
        <h3>{printText(entry.role)}</h3>
        <span>{printText(entry.years)}</span>
      </div>
      <ul>
        {entry.points.map((point, index) => (
          <li key={index} dangerouslySetInnerHTML={{ __html: printText(point) }} />
        ))}
      </ul>
    </article>
  );
}

function EducationEntry({ entry }) {
  return (
    <article className="pdf-education-entry">
      <div className="pdf-entry-heading">
        <h3>{printText(entry.title)}</h3>
        <span>{printText(entry.years)}</span>
      </div>
      <ul>
        {entry.details.map((detail, index) => (
          <li key={index} dangerouslySetInnerHTML={{ __html: printText(detail) }} />
        ))}
      </ul>
    </article>
  );
}

function PageMark() {
  return (
    <div className="pdf-page-mark" aria-hidden="true">
      <i />
      <i />
      <i />
    </div>
  );
}

function PageFooter({ page }) {
  return (
    <footer className="pdf-footer">
      <span>Nejc Blaznik · Curriculum vitae</span>
      <span>{page} / 2</span>
    </footer>
  );
}

export default function PrintCV({ data }) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${data.name} - CV`;
    return () => {
      document.title = previousTitle;
    };
  }, [data.name]);

  const professionalSocials = data.contact.socials.filter((social) =>
    ["linkedin", "github", "scholar"].includes(social.platform.toLowerCase()),
  );

  return (
    <main className="print-shell">
      <div className="print-toolbar">
        <div>
          <strong>PDF preview</strong>
          <span>Choose “Save as PDF” in the print dialog.</span>
        </div>
        <div className="print-toolbar-actions">
          <a href={import.meta.env.BASE_URL}>
            <ArrowLeft aria-hidden="true" size={15} />
            Website
          </a>
          <button type="button" onClick={() => window.print()}>
            <Printer aria-hidden="true" size={15} />
            Print / Save PDF
          </button>
        </div>
      </div>

      <div className="print-stage">
        <section className="pdf-page pdf-page-one">
          <PageMark />
          <header className="pdf-header">
            <p className="pdf-kicker">Curriculum vitae</p>
            <h1>{data.name}</h1>
            <div className="pdf-contact-line">
              <a href={`mailto:${data.contact.email}`}>{data.contact.email}</a>
              {professionalSocials.map((social) => (
                <a key={social.platform} href={social.link}>
                  {social.platform}
                </a>
              ))}
            </div>
          </header>

          <section className="pdf-profile">
            <SectionTitle>Profile</SectionTitle>
            <p dangerouslySetInnerHTML={{ __html: printText(data.profile) }} />
          </section>

          <section className="pdf-experience">
            <SectionTitle>Experience</SectionTitle>
            <div className="pdf-entry-list">
              {data.experience.map((entry, index) => (
                <ExperienceEntry key={index} entry={entry} />
              ))}
            </div>
          </section>
          <PageFooter page="1" />
        </section>

        <section className="pdf-page pdf-page-two">
          <PageMark />
          <div className="pdf-page-two-grid">
            <div>
              <section>
                <SectionTitle>Education</SectionTitle>
                <div className="pdf-education-list">
                  {data.education.map((entry, index) => (
                    <EducationEntry key={index} entry={entry} />
                  ))}
                </div>
              </section>

              <section className="pdf-awards-block">
                <SectionTitle>Awards & activities</SectionTitle>
                {Object.entries(data.awards).map(([key, items]) => (
                  <div className="pdf-compact-group" key={key}>
                    <h3>{key === "poster" ? "Conferences & posters" : "Leadership & activities"}</h3>
                    <ul>
                      {items.map((item, index) => (
                        <li key={index}>{printText(item)}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            </div>

            <div>
              <section>
                <SectionTitle>Technical skills</SectionTitle>
                <div className="pdf-skills-list">
                  {Object.entries(data.skills).map(([key, items]) => (
                    <div className="pdf-skill-group" key={key}>
                      <h3>{SKILL_LABELS[key] || key}</h3>
                      <p>{printText(items.join(" · "))}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="pdf-languages-block">
                <SectionTitle>Languages</SectionTitle>
                <dl className="pdf-languages">
                  {Object.entries(data.languages).map(([language, level]) => (
                    <div key={language}>
                      <dt>{printText(language)}</dt>
                      <dd>{printText(level)}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>
          </div>

          <section className="pdf-publications">
            <SectionTitle>Selected publications & patents</SectionTitle>
            <ol>
              {data.publications.map((publication, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: printText(publication) }} />
              ))}
            </ol>
          </section>
          <PageFooter page="2" />
        </section>
      </div>
    </main>
  );
}
