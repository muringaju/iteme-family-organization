import { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import api from "../api/axios.js";
import SectionHeading from "../components/SectionHeading.jsx";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in your name, email and message.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/messages", form);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page py-16">
      <SectionHeading
        eyebrow="Get in Touch"
        title="Contact Us"
        description="Questions about sponsoring a child, volunteering, or partnering with us? Send a message below."
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-[0.8fr,1.2fr]">
        <div className="space-y-5">
          {[
            [MapPin, "Our Office", "Kigali, Rwanda"],
            [Phone, "Phone", "+250 788 000 000"],
            [Mail, "Email", "info@itemeofhope.org"],
          ].map(([Icon, label, value]) => (
            <div key={label} className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-forest/10 text-forest">
                <Icon size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-forest-dark">{label}</p>
                <p className="text-sm text-ink/65">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-8">
          {sent ? (
            <div className="flex flex-col items-center py-10 text-center">
              <CheckCircle2 className="text-forest" size={44} />
              <p className="mt-4 font-display text-xl font-semibold text-forest-dark">Message sent</p>
              <p className="mt-2 text-sm text-ink/60">We'll get back to you as soon as possible.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label-field">Full name</label>
                  <input className="input-field" value={form.name} onChange={(e) => update("name", e.target.value)} />
                </div>
                <div>
                  <label className="label-field">Email</label>
                  <input type="email" className="input-field" value={form.email} onChange={(e) => update("email", e.target.value)} />
                </div>
              </div>
              <div>
                <label className="label-field">Subject</label>
                <input className="input-field" value={form.subject} onChange={(e) => update("subject", e.target.value)} />
              </div>
              <div>
                <label className="label-field">Message</label>
                <textarea rows={5} className="input-field" value={form.message} onChange={(e) => update("message", e.target.value)} />
              </div>
              {error && <p className="text-sm text-rust">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
