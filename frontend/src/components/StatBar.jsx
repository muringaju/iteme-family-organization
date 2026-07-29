export default function StatBar({ stats }) {
  return (
    <div className="grid grid-cols-2 divide-x divide-y divide-ivory/15 border border-ivory/15 sm:grid-cols-4 sm:divide-y-0">
      {stats.map((s) => (
        <div key={s.label} className="px-6 py-7 text-center">
          <p className="font-mono text-3xl font-semibold text-gold sm:text-4xl">{s.value}</p>
          <p className="mt-1.5 text-xs uppercase tracking-wide text-ivory/70">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
