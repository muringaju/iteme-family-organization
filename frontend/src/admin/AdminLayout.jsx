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
  Image,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

// =====================================================
// ADMIN NAVIGATION LINKS
// =====================================================

const links = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/admin/children",
    label: "Vulnerable Students",
    icon: Users,
  },
  {
    to: "/admin/staff",
    label: "Staff",
    icon: UserCog,
  },
  {
    to: "/admin/members",
    label: "Members",
    icon: Handshake,
  },
  {
    to: "/admin/donations",
    label: "Donations",
    icon: Wallet,
  },
  {
    to: "/admin/charity-week",
    label: "Charity Week",
    icon: CalendarHeart,
  },
  {
    to: "/admin/gallery",
    label: "Gallery",
    icon: Image,
  },
  {
    to: "/admin/reports",
    label: "Reports",
    icon: FileText,
  },
  {
    to: "/admin/messages",
    label: "Messages",
    icon: MessageSquare,
  },
];

// =====================================================
// ADMIN LAYOUT
// =====================================================

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  // ===================================================
  // LOGOUT
  // ===================================================

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen bg-ivory">

      {/* =================================================
          DESKTOP SIDEBAR
      ================================================= */}

      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-forest/10 bg-forest-dark text-ivory lg:flex">

        {/* -----------------------------------------------
            LOGO / BRAND
        ------------------------------------------------ */}

        <div className="flex items-center gap-2.5 px-6 py-6">

          <img
            src="/logo.png"
            alt="Iteme of Hope Family Organization Logo"
            className="h-10 w-10 rounded-full object-cover"
          />

          <div>
            <p className="font-display text-sm font-semibold leading-tight">
              Iteme of Hope
            </p>

            <p className="font-mono text-[10px] uppercase tracking-widest text-ivory/50">
              Admin Panel
            </p>
          </div>

        </div>


        {/* -----------------------------------------------
            NAVIGATION
        ------------------------------------------------ */}

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">

          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gold text-forest-dark shadow-lg shadow-black/10"
                      : "text-ivory/70 hover:bg-ivory/10 hover:text-ivory"
                  }`
                }
              >
                <Icon
                  size={17}
                  strokeWidth={2}
                  className="shrink-0"
                />

                <span>{link.label}</span>
              </NavLink>
            );
          })}

        </nav>


        {/* -----------------------------------------------
            ADMIN PROFILE / ACTIONS
        ------------------------------------------------ */}

        <div className="border-t border-ivory/10 px-4 py-4">

          <div className="mb-3">

            <p className="truncate text-xs font-semibold text-ivory">
              {admin?.name || "Administrator"}
            </p>

            <p className="truncate text-[11px] text-ivory/50">
              {admin?.email || "Admin account"}
            </p>

          </div>


          <div className="flex gap-2">

            {/* VIEW WEBSITE */}

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-ivory/20 py-2 text-xs transition hover:bg-ivory/10"
            >
              <ExternalLink size={13} />
              Site
            </a>


            {/* LOGOUT */}

            <button
              onClick={handleLogout}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-ivory/20 py-2 text-xs transition hover:border-rust hover:bg-rust"
            >
              <LogOut size={13} />
              Logout
            </button>

          </div>

        </div>

      </aside>


      {/* =================================================
          MOBILE TOP BAR
      ================================================= */}

      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-forest/10 bg-forest-dark px-4 py-3 text-ivory lg:hidden">

        <div className="flex items-center gap-2">

          <img
            src="/logo.png"
            alt="Iteme of Hope Logo"
            className="h-8 w-8 rounded-full object-cover"
          />

          <div>
            <span className="font-display text-sm font-semibold">
              Admin Panel
            </span>
          </div>

        </div>


        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg border border-ivory/20 px-3 py-1.5 text-xs transition hover:bg-rust hover:border-rust"
        >
          <LogOut size={13} />
          Logout
        </button>

      </div>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="flex-1 lg:ml-64">

        <div className="mt-14 lg:mt-0">

          {/* =================================================
              MOBILE NAVIGATION
          ================================================= */}

          <div className="flex gap-2 overflow-x-auto border-b border-forest/10 bg-white px-4 py-3 lg:hidden">

            {links.map((link) => {
              const Icon = link.icon;

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      isActive
                        ? "bg-forest text-ivory shadow-sm"
                        : "bg-forest/5 text-forest-dark hover:bg-forest/10"
                    }`
                  }
                >
                  <Icon size={14} />
                  {link.label}
                </NavLink>
              );
            })}

          </div>


          {/* =================================================
              PAGE CONTENT
          ================================================= */}

          <main className="min-h-[calc(100vh-0px)] p-5 sm:p-8">

            <Outlet />

          </main>

        </div>

      </div>

    </div>
  );
}