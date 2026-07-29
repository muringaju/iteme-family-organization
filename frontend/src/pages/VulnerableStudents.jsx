import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import api from "../api/axios.js";
import ChildCard from "../components/ChildCard.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

export default function VulnerableStudents() {
  const [children, setChildren] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/children")
      .then((res) => setChildren(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return children.filter((c) => {
      const raised = Number(c.amountRaised || 0);
      const needed = Number(c.feeNeeded || 0);
      const sponsored = needed > 0 && raised >= needed;
      const matchesFilter =
        filter === "all" ||
        (filter === "urgent" && !sponsored) ||
        (filter === "sponsored" && sponsored);
      const matchesQuery =
        c.fullName?.toLowerCase().includes(query.toLowerCase()) ||
        c.district?.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [children, query, filter]);

  return (
    <div className="container-page py-16">
      <SectionHeading
        eyebrow="Sponsor a Child"
        title="Vulnerable students needing school fees"
        description="Each profile is verified through a home visit by our field team. Choose a student to read their full story and contribute directly to their fees."
      />

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" size={16} />
          <input
            className="input-field pl-11"
            placeholder="Search by name or district…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {[
            ["all", "All"],
            ["urgent", "Needs Support"],
            ["sponsored", "Fully Sponsored"],
          ].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                filter === val ? "bg-forest text-ivory" : "bg-forest/5 text-forest-dark hover:bg-forest/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading && <p className="text-sm text-ink/50">Loading students…</p>}
        {!loading && filtered.length === 0 && (
          <p className="col-span-full text-sm text-ink/50">No students match your search.</p>
        )}
        {filtered.map((c) => (
          <ChildCard key={c.id} child={c} />
        ))}
      </div>
    </div>
  );
}
