export default function SectionHeading({ eyebrow, title, description, align = "left" }) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="font-display text-3xl font-semibold text-forest-dark sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-ink/70">{description}</p>}
    </div>
  );
}
