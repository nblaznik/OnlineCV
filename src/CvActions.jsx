import { FileDown } from "lucide-react";

export default function CvActions() {
  const pdfHref = `${import.meta.env.BASE_URL}nejc-blaznik-cv.pdf`;

  return (
    <div className="fixed right-3 top-3 z-50 hidden items-center gap-1.5 sm:right-5 sm:top-5 lg:flex">
      <a
        href={pdfHref}
        download="Nejc-Blaznik-CV.pdf"
        aria-label="Download CV as PDF"
        title="Download CV as PDF"
        className="flex h-10 items-center gap-1.5 rounded-full border border-[#0c302e]/15 bg-[#f7ecd3]/85 px-4 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[#35514c] shadow-[0_8px_24px_rgba(48,42,26,0.08)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-[#8a5725]/35 hover:bg-[#fbf3df] hover:text-[#6f421b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c302e] motion-reduce:transform-none"
      >
        <FileDown aria-hidden="true" size={15} strokeWidth={1.7} />
        Download CV
      </a>
    </div>
  );
}
