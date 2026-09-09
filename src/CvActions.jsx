import { FileDown } from "lucide-react";

export default function CvActions() {
  const pdfHref = `${import.meta.env.BASE_URL}nejc-blaznik-cv.pdf`;

  return (
    <div className="fixed right-3 top-3 z-50 flex items-center gap-1.5 sm:right-5 sm:top-5">
      <a
        href={pdfHref}
        download="Nejc-Blaznik-CV.pdf"
        aria-label="Download CV as PDF"
        title="Download CV as PDF"
        className="flex h-9 items-center gap-1.5 rounded-full border border-[#0c302e]/15 bg-[#f1e3c2]/85 px-3 text-[0.7rem] font-medium uppercase tracking-[0.08em] text-[#35514c] shadow-sm backdrop-blur-sm transition hover:border-[#0c302e]/35 hover:bg-[#f4e8cb] hover:text-[#0c302e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c302e]"
      >
        <FileDown aria-hidden="true" size={15} strokeWidth={1.7} />
        Download CV
      </a>
    </div>
  );
}
