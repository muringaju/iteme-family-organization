import { useEffect, useState } from "react";
import { Trash2, Mail, MailOpen } from "lucide-react";
import api from "../api/axios.js";

export default function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await api.get("/messages");
    setMessages(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function markRead(m) {
    const { data } = await api.put(`/messages/${m.id}`, { read: !m.read });
    setMessages((prev) => prev.map((x) => (x.id === m.id ? data : x)));
  }

  async function remove(m) {
    if (!confirm(`Delete message from ${m.name}?`)) return;
    await api.delete(`/messages/${m.id}`);
    setMessages((prev) => prev.filter((x) => x.id !== m.id));
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-forest-dark">Messages</h1>
      <p className="mt-1 text-sm text-ink/60">{messages.length} message(s) from the contact form</p>

      <div className="mt-6 space-y-3">
        {loading && <p className="text-sm text-ink/50">Loading…</p>}
        {!loading && messages.length === 0 && <p className="text-sm text-ink/50">No messages yet.</p>}
        {messages.map((m) => (
          <div key={m.id} className={`card p-5 ${!m.read ? "border-gold/50" : ""}`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-forest-dark">{m.subject}</p>
                <p className="text-xs text-ink/55">
                  {m.name} · {m.email} · {new Date(m.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => markRead(m)} className="rounded-lg p-2 text-forest hover:bg-forest/10" aria-label="Toggle read">
                  {m.read ? <MailOpen size={15} /> : <Mail size={15} />}
                </button>
                <button onClick={() => remove(m)} className="rounded-lg p-2 text-rust hover:bg-rust/10" aria-label="Delete">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
