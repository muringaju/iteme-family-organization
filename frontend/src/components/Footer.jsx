import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 bg-forest-dark text-ivory">
      <div className="container-page grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Iteme of Hope Family Organization" className="h-11 w-11 rounded-full object-cover" />
            <span className="font-display text-lg font-semibold">Iteme of Hope<br/>Family Organization</span>
          </div>
          <p className="mt-3 font-display text-sm italic text-gold">"Iteme ry'ibyiringiro" — Bridge of Hope</p>
          <p className="mt-4 text-sm leading-relaxed text-ivory/70">
            Walking alongside vulnerable children and families in Rwanda — funding school fees today,
            and building self-reliant families for tomorrow.
          </p>
          <div className="mt-5 flex gap-3">
            {[Facebook, Twitter, Instagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-9 w-9 place-items-center rounded-full border border-ivory/20 text-ivory/70 transition hover:border-gold hover:text-gold"
                aria-label="Social link"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="eyebrow text-gold">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-ivory/75">
            <li><Link to="/about" className="hover:text-gold">About Us</Link></li>
            <li><Link to="/students" className="hover:text-gold">Vulnerable Students</Link></li>
            <li><Link to="/charity-week" className="hover:text-gold">Charity Week</Link></li>
            <li><Link to="/members" className="hover:text-gold">Our Members</Link></li>
            <li><Link to="/staff" className="hover:text-gold">Our Staff</Link></li>
            <li><Link to="/reports" className="hover:text-gold">Reports</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow text-gold">Get Involved</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-ivory/75">
            <li><Link to="/donate" className="hover:text-gold">Donate</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Become a Volunteer</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Sponsor a Child</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Partner With Us</Link></li>
            <li><Link to="/login" className="hover:text-gold">Admin Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow text-gold">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-ivory/75">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
              Kigali, Rwanda
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="shrink-0 text-gold" />
              +250 788 000 000
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={16} className="shrink-0 text-gold" />
              info@itemeofhope.org
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-ivory/50 sm:flex-row">
          <p>© {year} Iteme of Hope Family Organization. All rights reserved.</p>
          <p>Registered Non-Profit · Kigali, Rwanda</p>
        </div>
      </div>
    </footer>
  );
}
