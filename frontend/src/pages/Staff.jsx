import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import api from "../api/axios.js";
import SectionHeading from "../components/SectionHeading.jsx";
import Avatar from "../components/Avatar.jsx";

export default function Staff() {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    api.get("/staff").then((res) => setStaff(res.data)).catch(() => {});
  }, []);

  return (
    <div className="container-page py-16">
      <SectionHeading
        eyebrow="The Team"
        title="Meet our staff"
        description="The people coordinating field visits, sponsorships, and financial transparency every day."
      />

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {staff.length === 0 && <p className="text-sm text-ink/50">No staff listed yet.</p>}
        {staff.map((s) => (
          <div key={s.id} className="card p-6 text-center">
            <Avatar name={s.name} image={s.image} size="lg" rounded="rounded-full" />
            <div className="mx-auto mt-4 w-fit">
              <h4 className="font-display text-lg font-semibold text-forest-dark">{s.name}</h4>
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-dark">{s.role}</p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">{s.bio}</p>
            {s.email && (
              <a
                href={`mailto:${s.email}`}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-forest hover:underline"
              >
                <Mail size={13} /> {s.email}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
