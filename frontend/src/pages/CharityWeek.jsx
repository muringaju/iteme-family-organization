import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Target, ArrowRight } from "lucide-react";
import api from "../api/axios.js";
import SectionHeading from "../components/SectionHeading.jsx";

export default function CharityWeek() {
  const [weeks, setWeeks] = useState([]);

  useEffect(() => {
    api.get("/charity-weeks").then((res) => setWeeks(res.data)).catch(() => {});
  }, []);

  const active = weeks.find((w) => w.status === "active");
  const others = weeks.filter((w) => w !== active);

  return (
    <div className="container-page py-16">
      <SectionHeading
        eyebrow="Annual Campaign"
        title="Charity Week"
        description="Once a year, we run a focused campaign to raise school fees, uniforms and supplies before the new term starts."
      />

      {active && (
        <div className="mt-10 overflow-hidden rounded-3xl bg-forest-dark text-ivory">
          <div className="p-8 sm:p-12">
            <span className="rounded-full bg-gold px-3 py-1 font-mono text-[11px] font-semibold uppercase text-forest-dark">
              Active Now
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">{active.title}</h2>
            <p className="mt-2 text-gold">{active.theme}</p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ivory/75">{active.description}</p>

            <div className="mt-6 flex flex-wrap gap-6 text-sm text-ivory/70">
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-gold" /> {active.startDate} — {active.endDate}
              </span>
              <span className="flex items-center gap-2">
                <Target size={16} className="text-gold" /> Goal: {Number(active.goalAmount || 0).toLocaleString()} RWF
              </span>
            </div>

            <div className="mt-6 max-w-md">
              <div className="flex items-center justify-between font-mono text-xs text-ivory/70">
                <span>{Number(active.raisedAmount || 0).toLocaleString()} RWF raised</span>
                <span>
                  {Math.min(
                    100,
                    Math.round((Number(active.raisedAmount || 0) / (Number(active.goalAmount) || 1)) * 100)
                  )}
                  %
                </span>
              </div>
              <div className="progress-track mt-1.5 !bg-ivory/15">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((Number(active.raisedAmount || 0) / (Number(active.goalAmount) || 1)) * 100)
                    )}%`,
                  }}
                />
              </div>
            </div>

            <Link to="/donate" className="btn-donate mt-8 inline-flex">
              Contribute to Charity Week <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}

      {!active && weeks.length === 0 && (
        <p className="mt-10 text-sm text-ink/50">No charity week is currently scheduled. Check back soon.</p>
      )}

      {others.length > 0 && (
        <div className="mt-14">
          <h3 className="font-display text-xl font-semibold text-forest-dark">Past Campaigns</h3>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((w) => (
              <div key={w.id} className="card p-6">
                <h4 className="font-display text-base font-semibold text-forest-dark">{w.title}</h4>
                <p className="mt-1 text-xs text-ink/50">{w.startDate} — {w.endDate}</p>
                <p className="mt-3 text-sm text-ink/65">{w.description}</p>
                <p className="mt-3 font-mono text-xs text-gold-dark">
                  Raised {Number(w.raisedAmount || 0).toLocaleString()} / {Number(w.goalAmount || 0).toLocaleString()} RWF
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
