import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-[80vh] place-items-center bg-forest-dark px-4">
      <div className="w-full max-w-sm rounded-3xl bg-ivory p-8 shadow-card">
        <img src="/logo.png" alt="Iteme of Hope Family Organization" className="mx-auto h-14 w-14 rounded-full object-cover" />
        <h1 className="mt-4 text-center font-display text-2xl font-semibold text-forest-dark">Admin Login</h1>
        <p className="mt-1 text-center text-xs text-ink/50">Iteme of Hope Family Organization Dashboard</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="label-field">Email</label>
            <input type="email" required className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label-field">Password</label>
            <input type="password" required className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-sm text-rust">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            <Lock size={15} /> {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <Link to="/" className="mt-6 block text-center text-xs text-ink/50 hover:text-forest">
          ← Back to website
        </Link>
      </div>
    </div>
  );
}
