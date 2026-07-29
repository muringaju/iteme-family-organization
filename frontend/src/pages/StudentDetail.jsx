import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, GraduationCap, ArrowLeft, ArrowRight } from "lucide-react";
import api from "../api/axios.js";
import Avatar from "../components/Avatar.jsx";

export default function StudentDetail() {
  const { id } = useParams();
  const [child, setChild] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api
      .get(`/children/${id}`)
      .then((res) => setChild(res.data))
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-ink/60">This student profile could not be found.</p>
        <Link to="/students" className="btn-secondary mt-6 inline-flex">Back to Students</Link>
      </div>
    );
  }

  if (!child) {
    return <div className="container-page py-24 text-center text-ink/50">Loading…</div>;
  }

  const raised = Number(child.amountRaised || 0);
  const needed = Number(child.feeNeeded || 0);
  const pct = needed > 0 ? Math.min(100, Math.round((raised / needed) * 100)) : 0;
  const sponsored = pct >= 100;

  return (
    <div className="container-page py-14">
      <Link to="/students" className="inline-flex items-center gap-1.5 text-sm font-medium text-forest hover:underline">
        <ArrowLeft size={15} /> Back to all students
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[0.9fr,1.1fr]">
        <div>
          <div className="h-80 overflow-hidden rounded-3xl lg:h-full">
            <Avatar name={child.fullName} image={child.image} size="full" rounded="rounded-none" />
          </div>
        </div>

        <div>
          <span
            className={`rounded-full px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wide ${
              sponsored ? "bg-forest text-ivory" : "bg-rust text-ivory"
            }`}
          >
            {sponsored ? "Fully Sponsored" : "Needs Support"}
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold text-forest-dark sm:text-4xl">
            {child.fullName}
          </h1>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink/60">
            <span className="flex items-center gap-1.5"><GraduationCap size={15} /> {child.grade}</span>
            <span className="flex items-center gap-1.5"><MapPin size={15} /> {child.district}</span>
            <span>Age {child.age}</span>
          </div>

          <p className="mt-6 text-base leading-relaxed text-ink/75">{child.story}</p>

          <div className="mt-8 card p-6">
            <div className="flex items-center justify-between font-mono text-sm text-ink/70">
              <span>{raised.toLocaleString()} RWF raised</span>
              <span>{needed.toLocaleString()} RWF goal</span>
            </div>
            <div className="progress-track mt-2">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-2 font-mono text-xs text-ink/50">{pct}% funded</p>

            <Link
              to={`/donate?childId=${child.id}&childName=${encodeURIComponent(child.fullName)}`}
              className="btn-donate mt-6 w-full"
            >
              Sponsor {child.fullName.split(" ")[0]} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
