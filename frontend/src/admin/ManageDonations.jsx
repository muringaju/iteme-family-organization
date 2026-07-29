import { useEffect, useState } from "react";
import { Trash2, CheckCircle2, Clock } from "lucide-react";
import api from "../api/axios.js";

export default function ManageDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await api.get("/donations");
    setDonations(data.slice().reverse());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleStatus(d) {
    const status = d.status === "confirmed" ? "pending" : "confirmed";
    const { data } = await api.put(`/donations/${d.id}`, { status });
    setDonations((prev) => prev.map((x) => (x.id === d.id ? data : x)));
  }

  async function remove(d) {
    if (!confirm(`Delete donation record from ${d.donorName}?`)) return;
    await api.delete(`/donations/${d.id}`);
    setDonations((prev) => prev.filter((x) => x.id !== d.id));
  }

  const total = donations.reduce((s, d) => s + Number(d.amount || 0), 0);
  const confirmed = donations.filter((d) => d.status === "confirmed").reduce((s, d) => s + Number(d.amount || 0), 0);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-forest-dark">Donations</h1>
      <p className="mt-1 text-sm text-ink/60">{donations.length} record(s) · {total.toLocaleString()} RWF total pledged · {confirmed.toLocaleString()} RWF confirmed</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-forest/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-forest/5 text-xs uppercase tracking-wide text-forest-dark/70">
            <tr>
              <th className="px-4 py-3">Donor</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest/5">
            {loading && <tr><td className="px-4 py-6 text-ink/50" colSpan={6}>Loading…</td></tr>}
            {!loading && donations.length === 0 && (
              <tr><td className="px-4 py-6 text-ink/50" colSpan={6}>No donations recorded yet.</td></tr>
            )}
            {donations.map((d) => (
              <tr key={d.id} className="hover:bg-forest/[0.03]">
                <td className="px-4 py-3 font-medium text-forest-dark">{d.donorName}</td>
                <td className="px-4 py-3 font-mono">{Number(d.amount).toLocaleString()} {d.currency}</td>
                <td className="px-4 py-3 text-ink/70">{d.method}</td>
                <td className="px-4 py-3 text-ink/60">{d.email || d.phone || "—"}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleStatus(d)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                      d.status === "confirmed" ? "bg-forest/10 text-forest" : "bg-gold/20 text-gold-dark"
                    }`}
                  >
                    {d.status === "confirmed" ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                    {d.status}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => remove(d)} className="rounded-lg p-2 text-rust hover:bg-rust/10" aria-label="Delete">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
