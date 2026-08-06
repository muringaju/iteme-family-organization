import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/students", label: "Vulnerable Students" },
  { to: "/charity-week", label: "Charity Week" },
  { to: "/gallery", label: "Gallery" },
  { to: "/members", label: "Members" },
  { to: "/staff", label: "Staff" },
  { to: "/reports", label: "Reports" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">

      {/* =====================================================
          MAIN NAVBAR
      ====================================================== */}
      <div className="container-page flex h-20 items-center justify-between">

        {/* =====================================================
            LOGO
        ====================================================== */}
        <Link
          to="/"
          className="flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <div className="rounded-full border-2 border-blue-100 bg-white p-0.5 shadow-sm">
            <img
              src="/logo.png"
              alt="Iteme of Hope Family Organization"
              className="h-11 w-11 rounded-full object-cover"
            />
          </div>

          <span className="font-display text-lg font-bold leading-none text-[#07182B]">
            Iteme of Hope

            <span className="mt-1 block font-mono text-[9px] font-medium uppercase tracking-[0.22em] text-blue-600">
              Family Organization
            </span>
          </span>
        </Link>

        {/* =====================================================
            DESKTOP NAVIGATION
        ====================================================== */}
        <nav className="hidden items-center gap-6 xl:flex">

          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `relative text-sm font-medium transition-colors ${
                  isActive
                    ? "font-semibold text-blue-600"
                    : "text-slate-600 hover:text-blue-600"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

        </nav>

        {/* =====================================================
            DESKTOP ACTIONS
        ====================================================== */}
        <div className="hidden items-center gap-4 lg:flex">

          {/* Admin */}
          <Link
            to="/login"
            className="text-sm font-medium text-slate-500 transition hover:text-blue-600"
          >
            Admin
          </Link>

          {/* Donate */}
          <Link
            to="/donate"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
          >
            Donate Now
          </Link>

        </div>

        {/* =====================================================
            MOBILE MENU BUTTON
        ====================================================== */}
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-[#07182B] transition hover:border-blue-300 hover:text-blue-600 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>

      </div>

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}
      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">

          <nav className="container-page flex flex-col gap-1 py-4">

            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 font-semibold text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* =================================================
                MOBILE ADMIN
            ================================================== */}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-blue-600"
            >
              Admin Login
            </Link>

            {/* =================================================
                MOBILE DONATE
            ================================================== */}
            <Link
              to="/donate"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Donate Now
            </Link>

          </nav>

        </div>
      )}

    </header>
  );
}

