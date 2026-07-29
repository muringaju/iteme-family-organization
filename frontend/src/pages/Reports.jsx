import { useEffect, useState } from "react";
import { FileText, Download } from "lucide-react";
import api from "../api/axios.js";
import SectionHeading from "../components/SectionHeading.jsx";
import { ASSET_BASE } from "../api/axios.js";

export default function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api.get("/reports").then((res) => setReports(res.data)).catch(() => {});
  }, []);

  return (
    <div className="container-page py-16">
      <SectionHeading
        eyebrow="Transparency"
        title="Annual & Financial Reports"
        description="We publish yearly reports covering how donations are spent and the impact on the families we serve."
      />

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {reports.length === 0 && <p className="text-sm text-ink/50">No reports published yet.</p>}
        {reports.map((r) => (
          <div key={r.id} className="card flex items-start gap-4 p-6">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-forest/10 text-forest">
              <FileText size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-display text-lg font-semibold text-forest-dark">{r.title}</h4>
              <p className="mt-0.5 text-xs font-mono text-gold-dark">{r.year}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{r.summary}</p>
              {r.fileUrl && (
                <a
                  href={r.fileUrl.startsWith("http") ? r.fileUrl : `${ASSET_BASE}${r.fileUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-forest hover:underline"
                >
                  <Download size={14} /> Download report
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
