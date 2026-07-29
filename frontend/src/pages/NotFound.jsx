import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-mono text-sm text-gold-dark">404</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-forest-dark">Page not found</h1>
      <p className="mt-3 text-sm text-ink/60">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-secondary mt-6">Back to Home</Link>
    </div>
  );
}
