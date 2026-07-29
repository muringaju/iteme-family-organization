import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Wallet, Handshake, FileText, MessageSquare, TrendingUp, CalendarHeart } from "lucide-react";
import api from "../api/axios.js";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/stats").then((res) => setStats(res.data)).catch(() => {});
  }, []);

  const cards = stats
    ? [
        { label: "Vulnerable Students", value: stats.totalChildren, icon: Users, to: "/admin/children" },
        { label: "Fully Sponsored", value: stats.fullySponsoredChildren, icon: TrendingUp, to: "/admin/children" },
        { label: "Total Raised (RWF)", value: stats.totalRaised.toLocaleString(), icon: Wallet, to: "/admin/donations" },
        { label: "Donations Recorded", value: stats.totalDonations, icon: Wallet, to: "/admin/donations" },
        { label: "Staff Members", value: stats.totalStaff, icon: Users, to: "/admin/staff" },
        { label: "Community Members", value: stats.totalMembers, icon: Handshake, to: "/admin/members" },
        { label: "Reports Published", value: stats.totalReports, icon: FileText, to: "/admin/reports" },
        { label: "Unread Messages", value: stats.unreadMessages, icon: MessageSquare, to: "/admin/messages" },
      ]
    : [];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-forest-dark">Dashboard Overview</h1>
      <p className="mt-1 text-sm text-ink/60">A snapshot of Iteme of Hope Family Organization's impact.</p>

      {!stats && <p className="mt-8 text-sm text-ink/50">Loading stats…</p>}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="card flex items-start justify-between p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div>
              <p className="font-mono text-2xl font-semibold text-forest-dark">{c.value}</p>
              <p className="mt-1 text-xs text-ink/55">{c.label}</p>
            </div>
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest/10 text-forest">
              <c.icon size={18} />
            </div>
          </Link>
        ))}
      </div>

      {stats?.activeCharityWeek && (
        <div className="mt-8 card flex items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-gold/20 text-gold-dark">
              <CalendarHeart size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-forest-dark">{stats.activeCharityWeek.title}</p>
              <p className="text-xs text-ink/55">
                {Number(stats.activeCharityWeek.raisedAmount || 0).toLocaleString()} /{" "}
                {Number(stats.activeCharityWeek.goalAmount || 0).toLocaleString()} RWF raised
              </p>
            </div>
          </div>
          <Link to="/admin/charity-week" className="btn-secondary !py-2 text-xs">
            Manage
          </Link>
        </div>
      )}
    </div>
  );
}
