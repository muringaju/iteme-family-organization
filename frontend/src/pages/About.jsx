import { Target, Eye, HeartHandshake, ShieldCheck } from "lucide-react";
import SectionHeading from "../components/SectionHeading.jsx";
import PathwayDivider from "../components/PathwayDivider.jsx";

const values = [
  { icon: HeartHandshake, title: "Compassion", text: "We meet every family with dignity, never pity." },
  { icon: ShieldCheck, title: "Transparency", text: "Every donation is tracked and publicly reported." },
  { icon: Target, title: "Self-Reliance", text: "We fund a path forward, not permanent dependency." },
  { icon: Eye, title: "Local Insight", text: "Field staff live in the communities we serve." },
];

export default function About() {
  return (
    <div>
      <section className="bg-forest-dark py-20 text-ivory">
        <div className="container-page">
          <p className="eyebrow text-gold">About Us</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold sm:text-5xl">
            Built by families, for families.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-ivory/75">
            Iteme of Hope Family Organization started in 2015 in Kigali when a group of neighbors
            pooled money to keep three children in school after their parents fell ill.
            Nine years later, we support hundreds of students and dozens of families
            across Rwanda.
          </p>
        </div>
      </section>

      <PathwayDivider className="text-forest-dark bg-forest-dark" />

      <section className="container-page grid gap-12 py-20 lg:grid-cols-2">
        <div className="card p-8">
          <Target className="text-gold-dark" size={26} />
          <h3 className="mt-4 font-display text-xl font-semibold text-forest-dark">Our Mission</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">
            To remove financial barriers to education for vulnerable children and to equip
            their guardians with the tools to build sustainable household income.
          </p>
        </div>
        <div className="card p-8">
          <Eye className="text-gold-dark" size={26} />
          <h3 className="mt-4 font-display text-xl font-semibold text-forest-dark">Our Vision</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">
            A generation of Rwandan children who complete their education and grow up in
            families that no longer need outside support to thrive.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-page">
          <SectionHeading eyebrow="What Guides Us" title="Our core values" align="center" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="card p-6 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-forest/10 text-forest">
                  <v.icon size={22} />
                </div>
                <h4 className="mt-4 font-display text-base font-semibold text-forest-dark">{v.title}</h4>
                <p className="mt-2 text-sm text-ink/65">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <SectionHeading
          eyebrow="How We Work"
          title="From referral to self-reliance"
          description="A typical family's journey with Iteme of Hope Family Organization."
        />
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Referral", "A school, church, or community leader refers a vulnerable child."],
            ["Home Visit", "Our field officer verifies the family's situation in person."],
            ["Sponsorship", "Donors fund school fees, uniforms and supplies for the term."],
            ["Self-Reliance", "Guardians join skills training to build lasting family income."],
          ].map(([title, text], i) => (
            <li key={title} className="relative rounded-2xl border border-forest/10 bg-white p-6">
              <span className="font-mono text-xs font-semibold text-gold-dark">0{i + 1}</span>
              <h4 className="mt-2 font-display text-base font-semibold text-forest-dark">{title}</h4>
              <p className="mt-2 text-sm text-ink/65">{text}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
