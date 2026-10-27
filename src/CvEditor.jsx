import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Download,
  FileText,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";

const SECTION_LABELS = {
  prog_data: "Programming & data",
  soft_eng: "Software engineering",
  experimental: "Experimental",
  other: "Other",
  poster: "Posters & conferences",
  extracurricular: "Extracurricular",
};

function clone(value) {
  return structuredClone(value);
}

function Field({ label, value, onChange, multiline = false, hint }) {
  const classes =
    "mt-1.5 w-full rounded-lg border border-[#0c302e]/15 bg-white/75 px-3 py-2 text-sm leading-relaxed text-[#0c302e] outline-none transition focus:border-[#0c302e]/45 focus:ring-2 focus:ring-[#0c302e]/10";

  return (
    <label className="block text-xs font-medium uppercase tracking-[0.09em] text-[#54635e]">
      {label}
      {multiline ? (
        <textarea
          value={value}
          rows={3}
          onChange={(event) => onChange(event.target.value)}
          className={`${classes} min-h-24 resize-y normal-case tracking-normal`}
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${classes} normal-case tracking-normal`}
        />
      )}
      {hint && (
        <span className="mt-1 block text-[0.68rem] font-normal normal-case tracking-normal text-[#69736f]">
          {hint}
        </span>
      )}
    </label>
  );
}

function IconButton({ label, onClick, disabled, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-8 shrink-0 items-center justify-center rounded-md border border-[#0c302e]/10 bg-white/60 text-[#54635e] transition hover:border-[#0c302e]/25 hover:text-[#0c302e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c302e] disabled:cursor-default disabled:opacity-25"
    >
      {children}
    </button>
  );
}

function ListEditor({ items, onChange, addLabel = "Add item", compact = false }) {
  const update = (index, value) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };

  const remove = (index) => onChange(items.filter((_, itemIndex) => itemIndex !== index));

  const move = (index, offset) => {
    const destination = index + offset;
    if (destination < 0 || destination >= items.length) return;
    const next = [...items];
    [next[index], next[destination]] = [next[destination], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          <textarea
            aria-label={`Item ${index + 1}`}
            value={item}
            rows={compact ? 1 : 2}
            onChange={(event) => update(index, event.target.value)}
            className="min-h-10 flex-1 resize-y rounded-lg border border-[#0c302e]/15 bg-white/75 px-3 py-2 text-sm leading-relaxed text-[#0c302e] outline-none transition focus:border-[#0c302e]/45 focus:ring-2 focus:ring-[#0c302e]/10"
          />
          <div className="grid grid-cols-2 gap-1">
            <IconButton label="Move up" onClick={() => move(index, -1)} disabled={index === 0}>
              <ArrowUp aria-hidden="true" size={14} />
            </IconButton>
            <IconButton
              label="Move down"
              onClick={() => move(index, 1)}
              disabled={index === items.length - 1}
            >
              <ArrowDown aria-hidden="true" size={14} />
            </IconButton>
            <IconButton label="Remove item" onClick={() => remove(index)}>
              <Trash2 aria-hidden="true" size={14} />
            </IconButton>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#0c302e]/25 px-3 py-2 text-xs font-medium text-[#35514c] transition hover:border-[#0c302e]/45 hover:bg-white/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c302e]"
      >
        <Plus aria-hidden="true" size={14} />
        {addLabel}
      </button>
    </div>
  );
}

function EditorSection({ title, description, children, open = false }) {
  return (
    <details
      open={open}
      className="group overflow-hidden rounded-xl border border-[#0c302e]/15 bg-[#f7edd7]/80 shadow-sm"
    >
      <summary className="cursor-pointer list-none px-4 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0c302e] sm:px-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-[#0c302e]">{title}</h2>
            {description && <p className="mt-0.5 text-xs text-[#69736f]">{description}</p>}
          </div>
          <span className="text-lg text-[#54635e] transition-transform group-open:rotate-45">+</span>
        </div>
      </summary>
      <div className="border-t border-[#0c302e]/10 px-4 py-5 sm:px-5">{children}</div>
    </details>
  );
}

function EntryCard({ children, onRemove, removeLabel }) {
  return (
    <article className="rounded-lg border border-[#0c302e]/10 bg-white/35 p-4">
      {children}
      <button
        type="button"
        onClick={onRemove}
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#8a3f2c] transition hover:text-[#612818] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8a3f2c]"
      >
        <Trash2 aria-hidden="true" size={13} />
        {removeLabel}
      </button>
    </article>
  );
}

export default function CvEditor({ initialData }) {
  const [draft, setDraft] = useState(() => clone(initialData));
  const [status, setStatus] = useState("");
  const initialJson = useMemo(() => JSON.stringify(initialData), [initialData]);
  const isDirty = JSON.stringify(draft) !== initialJson;

  const setPath = (path, value) => {
    setDraft((current) => {
      const next = clone(current);
      let cursor = next;
      path.slice(0, -1).forEach((key) => {
        cursor = cursor[key];
      });
      cursor[path.at(-1)] = value;
      return next;
    });
    setStatus("");
  };

  const save = async () => {
    setStatus("Saving…");
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}__cv/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Save failed.");
      setStatus(
        result.pdfUpdated
          ? "Saved source and updated the website PDF"
          : `Saved source. PDF update failed: ${result.pdfError}`,
      );
    } catch (error) {
      setStatus(error.message);
    }
  };

  const updatePdf = async () => {
    setStatus("Updating website PDF…");
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}__cv/export`, {
        method: "POST",
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "PDF export failed.");
      setStatus("Updated public/nejc-blaznik-cv.pdf");
    } catch (error) {
      setStatus(error.message);
    }
  };

  const download = () => {
    const blob = new Blob([`${JSON.stringify(draft, null, 2)}\n`], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "cv_data.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const updateLanguage = (index, part, value) => {
    const entries = Object.entries(draft.languages);
    entries[index][part === "name" ? 0 : 1] = value;
    setPath(["languages"], Object.fromEntries(entries));
  };

  return (
    <main className="h-[100dvh] overflow-y-auto bg-[#ddc490] text-[#0c302e]">
      <header className="relative z-20 border-b border-[#0c302e]/15 bg-[#efe0bd]/95 px-4 py-3 shadow-sm backdrop-blur-md sm:sticky sm:top-0 sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[#69736f]">Local tools</p>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">CV editor</h1>
          </div>
          <div className="grid grid-cols-3 items-center gap-2 sm:flex sm:flex-wrap sm:justify-end">
            <a
              href={import.meta.env.BASE_URL}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#0c302e]/15 bg-white/35 px-3 text-xs font-medium text-[#35514c] hover:bg-white/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c302e]"
            >
              <ArrowLeft aria-hidden="true" size={14} />
              Website
            </a>
            <a
              href={`${import.meta.env.BASE_URL}?view=print`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#0c302e]/15 bg-white/35 px-3 text-xs font-medium text-[#35514c] hover:bg-white/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c302e]"
            >
              <FileText aria-hidden="true" size={14} />
              PDF
            </a>
            <button
              type="button"
              onClick={download}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#0c302e]/15 bg-white/35 px-3 text-xs font-medium text-[#35514c] hover:bg-white/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c302e]"
            >
              <Download aria-hidden="true" size={14} />
              JSON
            </button>
            <button
              type="button"
              onClick={updatePdf}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#0c302e]/15 bg-white/35 px-3 text-xs font-medium text-[#35514c] hover:bg-white/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c302e]"
            >
              <RefreshCw aria-hidden="true" size={14} />
              Update PDF
            </button>
            <button
              type="button"
              onClick={() => {
                setDraft(clone(initialData));
                setStatus("");
              }}
              disabled={!isDirty}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-medium text-[#69736f] hover:text-[#0c302e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c302e] disabled:opacity-35"
            >
              <RotateCcw aria-hidden="true" size={14} />
              Reset
            </button>
            <button
              type="button"
              onClick={save}
              disabled={!isDirty}
              style={{ color: "#f7edd7", opacity: isDirty ? 1 : 0.55 }}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#0c302e] px-3.5 text-xs font-semibold text-[#f7edd7] shadow-sm transition hover:bg-[#17443f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c302e] focus-visible:ring-offset-2 disabled:cursor-default disabled:opacity-40"
            >
              <Save aria-hidden="true" size={14} />
              Save
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-3 px-4 py-6 pb-20 sm:px-6 sm:py-8">
        <div className="flex min-h-5 flex-col items-start justify-between gap-1 text-xs text-[#5c6762] sm:flex-row sm:items-center sm:gap-4">
          <p>Changes stay on this computer until you commit and push them.</p>
          <p aria-live="polite" className="text-right font-medium text-[#0c302e]">
            {status || (isDirty ? "Unsaved changes" : "Source is up to date")}
          </p>
        </div>

        <EditorSection title="Identity & profile" description="The introduction shared by the website and PDF." open>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" value={draft.name} onChange={(value) => setPath(["name"], value)} />
            <Field
              label="Email"
              value={draft.contact.email}
              onChange={(value) => setPath(["contact", "email"], value)}
            />
          </div>
          <div className="mt-4">
            <Field
              label="Headline"
              value={draft.headline || ""}
              onChange={(value) => setPath(["headline"], value)}
              hint="Shown prominently on the website and beneath your name in the PDF."
            />
          </div>
          <div className="mt-4">
            <Field
              label="Profile"
              value={draft.profile}
              onChange={(value) => setPath(["profile"], value)}
              multiline
              hint="Simple HTML such as <b> and <i> is preserved for existing emphasis."
            />
          </div>
        </EditorSection>

        <EditorSection title="Experience" description="Reorder individual bullet points with the arrow controls." open>
          <div className="space-y-3">
            {draft.experience.map((entry, index) => (
              <EntryCard
                key={index}
                removeLabel="Remove experience"
                onRemove={() => setPath(["experience"], draft.experience.filter((_, itemIndex) => itemIndex !== index))}
              >
                <div className="grid gap-3 sm:grid-cols-[1fr_10rem]">
                  <Field
                    label="Role / organisation"
                    value={entry.role}
                    onChange={(value) => setPath(["experience", index, "role"], value)}
                  />
                  <Field
                    label="Dates"
                    value={entry.years}
                    onChange={(value) => setPath(["experience", index, "years"], value)}
                  />
                </div>
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-[0.09em] text-[#54635e]">Highlights</p>
                  <ListEditor
                    items={entry.points}
                    onChange={(value) => setPath(["experience", index, "points"], value)}
                    addLabel="Add highlight"
                  />
                </div>
              </EntryCard>
            ))}
            <button
              type="button"
              onClick={() => setPath(["experience"], [...draft.experience, { role: "", years: "", points: [""] }])}
              className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#0c302e]/30 px-3 py-2 text-xs font-medium text-[#35514c] hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c302e]"
            >
              <Plus aria-hidden="true" size={14} />
              Add experience
            </button>
          </div>
        </EditorSection>

        <EditorSection title="Education" description="Degrees, dates, thesis details, and supervisors.">
          <div className="space-y-3">
            {draft.education.map((entry, index) => (
              <EntryCard
                key={index}
                removeLabel="Remove education"
                onRemove={() => setPath(["education"], draft.education.filter((_, itemIndex) => itemIndex !== index))}
              >
                <div className="grid gap-3 sm:grid-cols-[1fr_10rem]">
                  <Field
                    label="Degree / institution"
                    value={entry.title}
                    onChange={(value) => setPath(["education", index, "title"], value)}
                  />
                  <Field
                    label="Dates"
                    value={entry.years}
                    onChange={(value) => setPath(["education", index, "years"], value)}
                  />
                </div>
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-[0.09em] text-[#54635e]">Details</p>
                  <ListEditor
                    items={entry.details}
                    onChange={(value) => setPath(["education", index, "details"], value)}
                    addLabel="Add detail"
                  />
                </div>
              </EntryCard>
            ))}
            <button
              type="button"
              onClick={() => setPath(["education"], [...draft.education, { title: "", years: "", details: [""] }])}
              className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#0c302e]/30 px-3 py-2 text-xs font-medium text-[#35514c] hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c302e]"
            >
              <Plus aria-hidden="true" size={14} />
              Add education
            </button>
          </div>
        </EditorSection>

        <EditorSection title="Skills" description="Keep skills grouped for both formats.">
          <div className="grid gap-5 sm:grid-cols-2">
            {Object.entries(draft.skills).map(([key, items]) => (
              <div key={key}>
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.09em] text-[#54635e]">
                  {SECTION_LABELS[key] || key}
                </p>
                <ListEditor items={items} onChange={(value) => setPath(["skills", key], value)} compact />
              </div>
            ))}
          </div>
        </EditorSection>

        <EditorSection title="Publications & patents" description="Use the exact current publication status; HTML emphasis is supported.">
          <ListEditor
            items={draft.publications}
            onChange={(value) => setPath(["publications"], value)}
            addLabel="Add publication"
          />
        </EditorSection>

        <EditorSection title="Awards & activities">
          <div className="grid gap-5 sm:grid-cols-2">
            {Object.entries(draft.awards).map(([key, items]) => (
              <div key={key}>
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.09em] text-[#54635e]">
                  {SECTION_LABELS[key] || key}
                </p>
                <ListEditor items={items} onChange={(value) => setPath(["awards", key], value)} />
              </div>
            ))}
          </div>
        </EditorSection>

        <EditorSection title="Languages">
          <div className="space-y-2">
            {Object.entries(draft.languages).map(([name, level], index) => (
              <div key={`${name}-${index}`} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <input
                  aria-label={`Language ${index + 1}`}
                  value={name}
                  onChange={(event) => updateLanguage(index, "name", event.target.value)}
                  className="min-w-0 rounded-lg border border-[#0c302e]/15 bg-white/75 px-3 py-2 text-sm outline-none focus:border-[#0c302e]/45 focus:ring-2 focus:ring-[#0c302e]/10"
                />
                <input
                  aria-label={`Language level ${index + 1}`}
                  value={level}
                  onChange={(event) => updateLanguage(index, "level", event.target.value)}
                  className="min-w-0 rounded-lg border border-[#0c302e]/15 bg-white/75 px-3 py-2 text-sm outline-none focus:border-[#0c302e]/45 focus:ring-2 focus:ring-[#0c302e]/10"
                />
                <IconButton
                  label="Remove language"
                  onClick={() => {
                    const entries = Object.entries(draft.languages).filter((_, itemIndex) => itemIndex !== index);
                    setPath(["languages"], Object.fromEntries(entries));
                  }}
                >
                  <Trash2 aria-hidden="true" size={14} />
                </IconButton>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setPath(["languages"], { ...draft.languages, "New language": "level" })}
              className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#0c302e]/25 px-3 py-2 text-xs font-medium text-[#35514c] hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c302e]"
            >
              <Plus aria-hidden="true" size={14} />
              Add language
            </button>
          </div>
        </EditorSection>

        <EditorSection title="Contact & links" description="Phone numbers and addresses remain hidden from the public layouts.">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.09em] text-[#54635e]">Phone numbers</p>
              <ListEditor items={draft.contact.phone} onChange={(value) => setPath(["contact", "phone"], value)} compact />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.09em] text-[#54635e]">Addresses</p>
              <ListEditor items={draft.contact.address} onChange={(value) => setPath(["contact", "address"], value)} compact />
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.09em] text-[#54635e]">Social links</p>
            {draft.contact.socials.map((social, index) => (
              <div key={index} className="grid grid-cols-[8rem_1fr_auto] gap-2">
                <input
                  aria-label={`Platform ${index + 1}`}
                  value={social.platform}
                  onChange={(event) => setPath(["contact", "socials", index, "platform"], event.target.value)}
                  className="min-w-0 rounded-lg border border-[#0c302e]/15 bg-white/75 px-3 py-2 text-sm outline-none focus:border-[#0c302e]/45 focus:ring-2 focus:ring-[#0c302e]/10"
                />
                <input
                  aria-label={`Social URL ${index + 1}`}
                  value={social.link}
                  onChange={(event) => setPath(["contact", "socials", index, "link"], event.target.value)}
                  className="min-w-0 rounded-lg border border-[#0c302e]/15 bg-white/75 px-3 py-2 text-sm outline-none focus:border-[#0c302e]/45 focus:ring-2 focus:ring-[#0c302e]/10"
                />
                <IconButton
                  label="Remove social link"
                  onClick={() => setPath(["contact", "socials"], draft.contact.socials.filter((_, itemIndex) => itemIndex !== index))}
                >
                  <Trash2 aria-hidden="true" size={14} />
                </IconButton>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setPath(["contact", "socials"], [...draft.contact.socials, { platform: "", link: "" }])}
              className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#0c302e]/25 px-3 py-2 text-xs font-medium text-[#35514c] hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c302e]"
            >
              <Plus aria-hidden="true" size={14} />
              Add social link
            </button>
          </div>
        </EditorSection>
      </div>
    </main>
  );
}
