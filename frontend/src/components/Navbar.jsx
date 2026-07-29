import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/students", label: "Vulnerable Students" },
  { to: "/charity-week", label: "Charity Week" },
  { to: "/members", label: "Members" },
  { to: "/staff", label: "Staff" },
  { to: "/reports", label: "Reports" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-forest/10 bg-ivory/90 backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <img src="/logo.png" alt="Iteme of Hope Family Organization" className="h-11 w-11 rounded-full object-cover" />
          <span className="font-display text-lg font-semibold leading-none text-forest-dark">
            Iteme of Hope
            <span className="block font-mono text-[10px] font-normal uppercase tracking-[0.25em] text-forest/60">
              Family Organization
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-forest ${
                  isActive ? "text-forest font-semibold" : "text-ink/70"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/login" className="text-sm font-medium text-ink/60 hover:text-forest">
            Admin
          </Link>
          <Link to="/donate" className="btn-donate !px-5 !py-2.5 text-sm">
            Donate Now
          </Link>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-full border border-forest/20 lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-forest/10 bg-ivory lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive ? "bg-forest/10 text-forest" : "text-ink/70"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/login" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink/60">
              Admin Login
            </Link>
            <Link to="/donate" onClick={() => setOpen(false)} className="btn-donate mt-2 text-sm">
              Donate Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
