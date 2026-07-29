import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, Smartphone, Landmark, Globe2 } from "lucide-react";
import api from "../api/axios.js";
import SectionHeading from "../components/SectionHeading.jsx";

const methods = [
  { id: "Mobile Money", label: "Mobile Money", icon: Smartphone, hint: "MTN / Airtel — *182*8*1# then Merchant Code 123456" },
  { id: "Bank Transfer", label: "Bank Transfer", icon: Landmark, hint: "Bank of Kigali · Acc No. 000-111-2222 · Iteme of Hope Family Organization" },
  { id: "International", label: "International Card / Wire", icon: Globe2, hint: "We'll email secure payment instructions after you submit" },
];

export default function Donate() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    donorName: "",
    email: "",
    phone: "",
    amount: "",
    method: "Mobile Money",
    note: "",
    childId: params.get("childId") || "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const childName = params.get("childName");
  const suggested = [20000, 50000, 120000, 250000];

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.donorName || !form.amount) {
      setError("Please provide your name and the amount you'd like to give.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/donations", form);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <CheckCircle2 className="text-forest" size={56} />
        <h1 className="mt-6 font-display text-3xl font-semibold text-forest-dark">Thank you!</h1>
        <p className="mt-3 max-w-md text-sm text-ink/65">
          Your pledge has been recorded. Our finance team will confirm your {form.method.toLowerCase()}{" "}
          payment and follow up by email or phone.
        </p>
      </div>
    );
  }

  return (
    <div className="container-page py-16">
      <SectionHeading
        eyebrow="Give Today"
        title={childName ? `Sponsor ${childName}` : "Make a Donation"}
        description="Every donation is recorded and reported back to you. Choose an amount and payment method below."
      />

      <form onSubmit={handleSubmit} className="mt-10 grid gap-10 lg:grid-cols-[1fr,0.85fr]">
        <div className="space-y-6">
          <div>
            <label className="label-field">Suggested amount (RWF)</label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {suggested.map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => update("amount", amt)}
                  className={`rounded-xl border-2 py-3 font-mono text-sm font-semibold transition ${
                    Number(form.amount) === amt
                      ? "border-forest bg-forest text-ivory"
                      : "border-forest/15 text-forest-dark hover:border-forest/40"
                  }`}
                >
                  {amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label-field">Or enter a custom amount</label>
            <input
              type="number"
              min="0"
              className="input-field"
              placeholder="e.g. 75000"
              value={form.amount}
              onChange={(e) => update("amount", e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">Full name</label>
              <input className="input-field" value={form.donorName} onChange={(e) => update("donorName", e.target.value)} />
            </div>
            <div>
              <label className="label-field">Email</label>
              <input type="email" className="input-field" value={form.email} onChange={(e) => update("email", e.target.value)} />
            </div>
            <div>
              <label className="label-field">Phone</label>
              <input className="input-field" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
          </div>

          <div>
            <label className="label-field">Note (optional)</label>
            <textarea
              rows={3}
              className="input-field"
              placeholder="e.g. In memory of…, or a message to the family"
              value={form.note}
              onChange={(e) => update("note", e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-rust">{error}</p>}

          <button type="submit" disabled={loading} className="btn-donate w-full sm:w-auto">
            {loading ? "Submitting…" : "Confirm Donation Pledge"}
          </button>
        </div>

        <div>
          <label className="label-field">Payment method</label>
          <div className="space-y-3">
            {methods.map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => update("method", m.id)}
                className={`flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left transition ${
                  form.method === m.id ? "border-forest bg-forest/5" : "border-forest/10"
                }`}
              >
                <m.icon size={20} className="mt-0.5 shrink-0 text-forest" />
                <div>
                  <p className="text-sm font-semibold text-forest-dark">{m.label}</p>
                  <p className="mt-0.5 text-xs text-ink/55">{m.hint}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
