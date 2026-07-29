import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Home as HomeIcon, Sprout } from "lucide-react";
import api from "../api/axios.js";
import SectionHeading from "../components/SectionHeading.jsx";
import ChildCard from "../components/ChildCard.jsx";
import StatBar from "../components/StatBar.jsx";
import PathwayDivider from "../components/PathwayDivider.jsx";

export default function Home() {
  const [children, setChildren] = useState([]);
  const [charityWeek, setCharityWeek] = useState(null);

  useEffect(() => {
    api.get("/children").then((res) => setChildren(res.data.slice(0, 3))).catch(() => {});
    api
      .get("/charity-weeks")
      .then((res) => {
        const active = res.data.find((c) => c.status === "active") || res.data[0];
        setCharityWeek(active || null);
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-forest-dark text-ivory">
        <div className="bg-grain absolute inset-0 opacity-40" />
        <div className="container-page relative grid gap-12 py-20 lg:grid-cols-[1.1fr,0.9fr] lg:py-28">
          <div className="flex flex-col justify-center">
            <p className="eyebrow text-gold">"Iteme ry'ibyiringiro" · Bridge of Hope</p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl">
              Every child deserves
              <span className="block text-gold">a path back to school.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-ivory/75">
              Iteme of Hope Family Organization pays school fees for vulnerable students and walks
              alongside their families — from a single term of tuition to a self-reliant future.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/donate" className="btn-donate">
                Sponsor a Child <ArrowRight size={17} />
              </Link>
              <Link to="/students" className="btn-secondary !border-ivory/30 !text-ivory hover:!bg-ivory hover:!text-forest-dark">
                Meet the Students
              </Link>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="grid w-full max-w-sm grid-cols-2 gap-4">
              <div className="col-span-2 rounded-3xl bg-forest-light/40 p-6 backdrop-blur">
                <BookOpen className="text-gold" size={28} />
                <p className="mt-4 font-display text-xl font-semibold">Back-to-School Fund</p>
                <p className="mt-1 text-sm text-ivory/70">Fees, uniforms &amp; supplies for the new term</p>
              </div>
              <div className="rounded-3xl bg-gold/90 p-6 text-forest-dark">
                <Sprout size={24} />
                <p className="mt-3 font-display text-lg font-semibold">Self-Reliance</p>
                <p className="mt-1 text-xs text-forest-dark/70">Family income support</p>
              </div>
              <div className="rounded-3xl bg-rust/90 p-6">
                <HomeIcon size={24} />
                <p className="mt-3 font-display text-lg font-semibold">Family Care</p>
                <p className="mt-1 text-xs text-ivory/80">Home &amp; welfare visits</p>
              </div>
            </div>
          </div>
        </div>

        <StatBar
          stats={[
            { value: "300+", label: "Students Supported" },
            { value: "120", label: "Families Reached" },
            { value: "18", label: "Partner Schools" },
            { value: "9 yrs", label: "Serving Communities" },
          ]}
        />
      </section>

      <PathwayDivider className="text-forest-dark bg-forest-dark" />

      {/* MISSION */}
      <section className="container-page py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Our Mission"
              title="From vulnerable to self-reliant — one family at a time."
              description="We believe education is the surest path out of vulnerability. Beyond paying school fees, we equip parents and guardians with skills and small grants so their households no longer depend on outside support."
            />
            <ul className="mt-8 space-y-4">
              {[
                ["Pay school fees, uniforms and learning materials for vulnerable children"],
                ["Train guardians in income-generating skills and small business basics"],
                ["Track every family's progress with transparent, published reports"],
              ].map(([text], i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/20 font-mono text-xs font-semibold text-gold-dark">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-ink/75">{text}</span>
                </li>
              ))}
            </ul>
            <Link to="/about" className="btn-secondary mt-8 inline-flex">
              Read Our Story <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 rounded-3xl bg-forest p-8 text-ivory">
              <p className="font-display text-4xl font-semibold text-gold">84%</p>
              <p className="mt-2 text-sm text-ivory/75">
                of sponsored students remained enrolled through the full academic year in 2025
              </p>
            </div>
            <div className="rounded-3xl bg-sky/15 p-6">
              <p className="font-display text-3xl font-semibold text-sky">12</p>
              <p className="mt-1 text-xs text-ink/60">family businesses launched</p>
            </div>
            <div className="rounded-3xl bg-rust/10 p-6">
              <p className="font-display text-3xl font-semibold text-rust">45M+</p>
              <p className="mt-1 text-xs text-ink/60">RWF raised to date</p>
            </div>
          </div>
        </div>
      </section>

      {/* CHARITY WEEK BANNER */}
      {charityWeek && (
        <section className="container-page">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-gold px-8 py-10 sm:flex-row sm:items-center">
            <div>
              <p className="eyebrow text-forest-dark/70">Happening Now</p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-forest-dark sm:text-3xl">
                {charityWeek.title}
              </h3>
              <p className="mt-2 max-w-xl text-sm text-forest-dark/80">{charityWeek.description}</p>
            </div>
            <Link to="/charity-week" className="btn-primary !bg-forest-dark !text-ivory shrink-0 hover:!bg-forest">
              See Charity Week <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}

      {/* FEATURED STUDENTS */}
      <section className="container-page py-20">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Vulnerable Students"
            title="Students who need your support right now"
            description="Every profile is reviewed by our field team before publishing. Sponsor a term of school fees, or contribute what you can."
          />
          <Link to="/students" className="btn-secondary shrink-0">
            View All Students <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {children.length === 0 && (
            <p className="col-span-full text-sm text-ink/50">
              No student profiles published yet. Check back soon.
            </p>
          )}
          {children.map((c) => (
            <ChildCard key={c.id} child={c} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-24">
        <div className="rounded-3xl bg-forest-dark px-8 py-16 text-center text-ivory">
          <h3 className="font-display text-3xl font-semibold sm:text-4xl">
            You can put a child back in the classroom today.
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-sm text-ivory/70">
            A single term of school fees costs as little as 30,000 RWF. Every contribution,
            large or small, is tracked and reported back to you.
          </p>
          <Link to="/donate" className="btn-donate mt-8 inline-flex">
            Make a Donation <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}
