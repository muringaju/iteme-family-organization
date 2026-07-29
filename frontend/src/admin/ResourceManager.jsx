import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Image as ImageIcon } from "lucide-react";
import api, { ASSET_BASE } from "../api/axios.js";

/**
 * Generic admin CRUD manager.
 *
 * @param {string} title
 * @param {string} endpoint - API path, e.g. "/children"
 * @param {Array} fields - [{ name, label, type: 'text'|'number'|'textarea'|'date'|'select', options, required }]
 * @param {boolean} withImage - whether this resource supports an image upload
 * @param {string} nameField - field used as the row title in the table
 * @param {Array} columns - extra field names to show as table columns
 */
export default function ResourceManager({ title, endpoint, fields, withImage = false, nameField, columns = [] }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get(endpoint);
      setItems(data.slice().reverse());
    } catch (e) {
      setError("Could not load data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  function openCreate() {
    const blank = {};
    fields.forEach((f) => (blank[f.name] = ""));
    setForm(blank);
    setEditing(null);
    setFile(null);
    setError("");
    setModalOpen(true);
  }

  function openEdit(item) {
    setForm({ ...item });
    setEditing(item);
    setFile(null);
    setError("");
    setModalOpen(true);
  }

  async function handleDelete(item) {
    if (!confirm(`Delete "${item[nameField] || "this item"}"? This cannot be undone.`)) return;
    try {
      await api.delete(`${endpoint}/${item.id}`);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (e) {
      alert(e.response?.data?.message || "Could not delete.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      let payload;
      let headers = {};
      if (withImage) {
        payload = new FormData();
        Object.entries(form).forEach(([k, v]) => payload.append(k, v ?? ""));
        if (file) payload.append("image", file);
        headers = { "Content-Type": "multipart/form-data" };
      } else {
        payload = form;
      }

      if (editing) {
        const { data } = await api.put(`${endpoint}/${editing.id}`, payload, { headers });
        setItems((prev) => prev.map((i) => (i.id === editing.id ? data : i)));
      } else {
        const { data } = await api.post(endpoint, payload, { headers });
        setItems((prev) => [data, ...prev]);
      }
      setModalOpen(false);
    } catch (e) {
      setError(e.response?.data?.message || "Could not save. Please check the form.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-forest-dark">{title}</h1>
          <p className="mt-1 text-sm text-ink/60">{items.length} record{items.length === 1 ? "" : "s"}</p>
        </div>
        <button onClick={openCreate} className="btn-primary !py-2.5 text-sm">
          <Plus size={16} /> Add New
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-forest/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-forest/5 text-xs uppercase tracking-wide text-forest-dark/70">
            <tr>
              <th className="px-4 py-3">{nameField ? "Name" : "ID"}</th>
              {columns.map((c) => (
                <th key={c.name} className="px-4 py-3">{c.label}</th>
              ))}
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest/5">
            {loading && (
              <tr><td className="px-4 py-6 text-ink/50" colSpan={columns.length + 2}>Loading…</td></tr>
            )}
            {!loading && items.length === 0 && (
              <tr><td className="px-4 py-6 text-ink/50" colSpan={columns.length + 2}>No records yet. Click "Add New" to create one.</td></tr>
            )}
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-forest/[0.03]">
                <td className="max-w-[220px] truncate px-4 py-3 font-medium text-forest-dark">
                  {nameField ? item[nameField] : item.id}
                </td>
                {columns.map((c) => (
                  <td key={c.name} className="max-w-[220px] truncate px-4 py-3 text-ink/70">
                    {c.render ? c.render(item) : String(item[c.name] ?? "—")}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(item)} className="rounded-lg p-2 text-forest hover:bg-forest/10" aria-label="Edit">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(item)} className="rounded-lg p-2 text-rust hover:bg-rust/10" aria-label="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-forest-dark">
                {editing ? "Edit Record" : "Add New Record"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="rounded-lg p-1.5 hover:bg-forest/10">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {withImage && (
                <div>
                  <label className="label-field">Photo</label>
                  <div className="flex items-center gap-3">
                    {(editing?.image || file) && (
                      <div className="h-14 w-14 overflow-hidden rounded-xl bg-forest/10">
                        <img
                          src={file ? URL.createObjectURL(file) : `${ASSET_BASE}${editing.image}`}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-forest/30 px-4 py-2.5 text-xs text-ink/60 hover:border-forest">
                      <ImageIcon size={15} />
                      {file ? file.name : "Choose image"}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                    </label>
                  </div>
                </div>
              )}

              {fields.map((f) => (
                <div key={f.name}>
                  <label className="label-field">{f.label}{f.required && " *"}</label>
                  {f.type === "textarea" ? (
                    <textarea
                      rows={4}
                      required={f.required}
                      className="input-field"
                      value={form[f.name] ?? ""}
                      onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
                    />
                  ) : f.type === "select" ? (
                    <select
                      required={f.required}
                      className="input-field"
                      value={form[f.name] ?? ""}
                      onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
                    >
                      <option value="">Select…</option>
                      {f.options.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={f.type || "text"}
                      required={f.required}
                      className="input-field"
                      value={form[f.name] ?? ""}
                      onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
                    />
                  )}
                </div>
              ))}

              {error && <p className="text-sm text-rust">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? "Saving…" : editing ? "Save Changes" : "Create"}
                </button>
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
