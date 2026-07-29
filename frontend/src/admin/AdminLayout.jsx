import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Handshake,
  Wallet,
  FileText,
  CalendarHeart,
  MessageSquare,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/children", label: "Vulnerable Students", icon: Users },
  { to: "/admin/staff", label: "Staff", icon: UserCog },
  { to: "/admin/members", label: "Members", icon: Handshake },
  { to: "/admin/donations", label: "Donations", icon: Wallet },
  { to: "/admin/charity-week", label: "Charity Week", icon: CalendarHeart },
  { to: "/admin/reports", label: "Reports", icon: FileText },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen bg-ivory">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-forest/10 bg-forest-dark text-ivory lg:flex">
        <div className="flex items-center gap-2.5 px-6 py-6">
          <img src="/logo.png" alt="Logo" className="h-10 w-10 rounded-full object-cover" />
          <div>
            <p className="font-display text-sm font-semibold leading-tight">Iteme of Hope</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ivory/50">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? "bg-gold text-forest-dark" : "text-ivory/70 hover:bg-ivory/10"
                }`
              }
            >
              <l.icon size={17} />
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-ivory/10 px-4 py-4">
          <p className="truncate text-xs font-semibold text-ivory">{admin?.name}</p>
          <p className="truncate text-[11px] text-ivory/50">{admin?.email}</p>
          <div className="mt-3 flex gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-ivory/20 py-2 text-xs hover:bg-ivory/10"
            >
              <ExternalLink size={13} /> Site
            </a>
            <button
              onClick={handleLogout}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-ivory/20 py-2 text-xs hover:bg-rust hover:border-rust"
            >
              <LogOut size={13} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-forest/10 bg-forest-dark px-4 py-3 text-ivory lg:hidden">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-8 rounded-full object-cover" />
          <span className="font-display text-sm font-semibold">Admin Panel</span>
        </div>
        <button onClick={handleLogout} className="rounded-lg border border-ivory/20 px-3 py-1.5 text-xs">
          Logout
        </button>
      </div>

      <div className="flex-1 lg:ml-64">
        <div className="mt-14 lg:mt-0">
          {/* Mobile nav scroller */}
          <div className="flex gap-2 overflow-x-auto border-b border-forest/10 bg-white px-4 py-3 lg:hidden">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
                    isActive ? "bg-forest text-ivory" : "bg-forest/5 text-forest-dark"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <main className="p-5 sm:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
