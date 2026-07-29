import { useEffect, useState } from "react";
import { Calendar, Mail } from "lucide-react";
import api from "../api/axios.js";
import SectionHeading from "../components/SectionHeading.jsx";
import Avatar from "../components/Avatar.jsx";

export default function Members() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    api.get("/members").then((res) => setMembers(res.data)).catch(() => {});
  }, []);

  return (
    <div className="container-page py-16">
      <SectionHeading
        eyebrow="Our Community"
        title="Members & Community Partners"
        description="Volunteers, community partners, and long-standing supporters who make our work possible."
      />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {members.length === 0 && <p className="text-sm text-ink/50">No members listed yet.</p>}
        {members.map((m) => (
          <div key={m.id} className="card flex items-center gap-4 p-5">
            <Avatar name={m.name} image={m.image} size="md" rounded="rounded-full" />
            <div className="min-w-0">
              <h4 className="truncate font-display text-base font-semibold text-forest-dark">{m.name}</h4>
              <p className="text-xs font-medium text-gold-dark">{m.membershipType}</p>
              <div className="mt-1.5 flex flex-col gap-1 text-xs text-ink/50">
                {m.joinedDate && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} /> Joined {m.joinedDate}
                  </span>
                )}
                {m.contact && (
                  <span className="flex items-center gap-1.5 truncate">
                    <Mail size={12} /> {m.contact}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
