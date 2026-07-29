import { Link } from "react-router-dom";
import { MapPin, GraduationCap } from "lucide-react";
import Avatar from "./Avatar.jsx";

export default function ChildCard({ child }) {
  const raised = Number(child.amountRaised || 0);
  const needed = Number(child.feeNeeded || 0);
  const pct = needed > 0 ? Math.min(100, Math.round((raised / needed) * 100)) : 0;
  const sponsored = pct >= 100;

  return (
    <div className="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-48">
        <Avatar name={child.fullName} image={child.image} size="full" rounded="rounded-none" />
        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wide ${
            sponsored ? "bg-forest text-ivory" : "bg-rust text-ivory"
          }`}
        >
          {sponsored ? "Fully Sponsored" : "Needs Support"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold text-forest-dark">{child.fullName}</h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink/60">
          <span className="flex items-center gap-1"><GraduationCap size={13} /> {child.grade}</span>
          <span className="flex items-center gap-1"><MapPin size={13} /> {child.district}</span>
          <span>Age {child.age}</span>
        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink/70">{child.story}</p>

        <div className="mt-4">
          <div className="flex items-center justify-between font-mono text-xs text-ink/60">
            <span>{needed ? needed.toLocaleString() : "—"} RWF goal</span>
            <span>{pct}%</span>
          </div>
          <div className="progress-track mt-1.5">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <Link
          to={`/students/${child.id}`}
          className="btn-secondary mt-5 w-full !py-2.5 text-sm"
        >
          View Story &amp; Sponsor
        </Link>
      </div>
    </div>
  );
}
