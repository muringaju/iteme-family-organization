import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Heart,
  Users,
  GraduationCap,
  Target,
  Eye,
  ShieldCheck,
  HandHeart,
  BookOpen,
  Laptop,
  CheckCircle2,
  Quote,
  Sparkles,
  Globe2,
  Lightbulb,
} from "lucide-react";

const About = () => {
  return (
    <main className="min-h-screen bg-white text-slate-800">

      {/* =========================================================
          1. ABOUT HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-blue-950">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.22),transparent_35%)]" />

        <div className="relative mx-auto grid min-h-[560px] max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:px-8">

          {/* LEFT */}
          <div className="text-white">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-4 py-2 text-sm font-semibold text-blue-200">
              <Sparkles size={16} />
              ABOUT OUR ORGANIZATION
            </div>

            <h1 className="text-5xl font-black leading-[1.05] sm:text-6xl">
              Creating hope.
              <span className="block text-blue-300">
                Building futures.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-blue-100">
              ITEME of HOPE FAMILY ORGANIZATION is committed to empowering
              vulnerable students and families through education, skills,
              mentorship, compassion, and community action.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-blue-900 transition hover:-translate-y-1 hover:bg-blue-50"
              >
                Work With Us
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/donate"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                Support Our Mission
                <Heart size={18} />
              </Link>

            </div>

          </div>


          {/* RIGHT - FAMILY IMAGE */}
          <div className="relative">

            <div className="absolute -inset-5 rounded-[2rem] bg-blue-500/20 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">

              <img
                src="/images/family1.jpg"
                alt="Family and community support"
                className="h-[450px] w-full object-cover transition duration-700 hover:scale-105"
              />

              <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 p-5 shadow-xl backdrop-blur">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                    <Heart size={23} fill="currentColor" />
                  </div>

                  <div>
                    <p className="font-black text-slate-900">
                      Hope Starts With Us
                    </p>

                    <p className="text-sm text-slate-500">
                      Education • Care • Opportunity
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          2. WHO WE ARE
      ========================================================= */}
      <section className="px-6 py-24 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">

            {/* Small label column */}
            <div>

              <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
                Who We Are
              </span>

              <h2 className="mt-4 text-4xl font-black leading-tight text-slate-900">
                A community built around
                <span className="block text-blue-700">
                  hope and service.
                </span>
              </h2>

            </div>


            {/* Description */}
            <div>

              <p className="text-xl leading-9 text-slate-600">
                ITEME of HOPE FAMILY ORGANIZATION is a community-focused
                organization dedicated to creating opportunities for vulnerable
                students and families.
              </p>

              <p className="mt-5 leading-8 text-slate-600">
                We believe that every child deserves access to education,
                encouragement, basic support, and the opportunity to develop
                their potential. Our work brings together young people,
                families, volunteers, partners, and supporters around a shared
                responsibility to make a positive difference.
              </p>

              <p className="mt-5 leading-8 text-slate-600">
                Through education support, skills development, mentorship,
                community activities, and practical assistance, we seek to
                turn compassion into meaningful and sustainable action.
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          3. OUR STORY
      ========================================================= */}
      <section className="bg-slate-50 px-6 py-24 lg:px-8">

        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">

          {/* IMAGE */}
          <div className="relative">

            <img
              src="/images/family1.jpg"
              alt="ITEME family and community"
              className="h-[520px] w-full rounded-[2rem] object-cover shadow-2xl"
            />

            <div className="absolute -bottom-6 right-6 rounded-2xl bg-blue-700 px-6 py-5 text-white shadow-xl">

              <p className="text-3xl font-black">
                2024
              </p>

              <p className="text-sm text-blue-100">
                Founded with purpose
              </p>

            </div>

          </div>


          {/* TEXT */}
          <div>

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
              Our Story
            </span>

            <h2 className="mt-4 text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
              One idea.
              <span className="block text-blue-700">
                One community.
              </span>
              <span className="block">
                One shared hope.
              </span>
            </h2>

            <p className="mt-6 leading-8 text-slate-600">
              ITEME of HOPE FAMILY ORGANIZATION was founded with the belief
              that young people and communities can be powerful agents of
              positive change.
            </p>

            <p className="mt-5 leading-8 text-slate-600">
              What began as a commitment to support vulnerable students has
              developed into a broader mission focused on education,
              empowerment, family support, and community development.
            </p>

            <p className="mt-5 leading-8 text-slate-600">
              Today, we continue to grow through collaboration with members,
              volunteers, schools, families, donors, and community partners.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              <StoryPoint text="Student-centered support" />
              <StoryPoint text="Community participation" />
              <StoryPoint text="Education and skills" />
              <StoryPoint text="Long-term empowerment" />

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          4. MISSION & VISION
      ========================================================= */}
      <section className="px-6 py-24 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
              Our Direction
            </span>

            <h2 className="mt-4 text-4xl font-black text-slate-900 sm:text-5xl">
              What guides our work
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              Our mission and vision provide the foundation for every program,
              partnership, and community activity we undertake.
            </p>

          </div>


          <div className="mt-14 grid gap-7 lg:grid-cols-2">

            {/* MISSION */}
            <div className="relative overflow-hidden rounded-[2rem] bg-blue-700 p-8 text-white shadow-xl sm:p-10">

              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" />

              <div className="relative">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                  <Target size={28} />
                </div>

                <h3 className="mt-7 text-3xl font-black">
                  Our Mission
                </h3>

                <p className="mt-5 text-lg leading-8 text-blue-50">
                  To create opportunities for underprivileged children to
                  access quality education, develop useful skills, and build
                  brighter futures.
                </p>

              </div>

            </div>


            {/* VISION */}
            <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl sm:p-10">

              <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full border border-white/10" />

              <div className="relative">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600">
                  <Eye size={28} />
                </div>

                <h3 className="mt-7 text-3xl font-black">
                  Our Vision
                </h3>

                <p className="mt-5 text-lg leading-8 text-slate-300">
                  A community where every vulnerable student has the
                  opportunity, support, and confidence to reach their full
                  potential.
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          5. OUR VALUES
      ========================================================= */}
      <section className="bg-blue-50 px-6 py-24 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="grid items-end gap-8 lg:grid-cols-2">

            <div>

              <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
                Our Values
              </span>

              <h2 className="mt-4 text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
                The principles that
                <span className="block text-blue-700">
                  guide our service.
                </span>
              </h2>

            </div>

            <p className="leading-8 text-slate-600">
              We strive to ensure that our work is compassionate, responsible,
              inclusive, and focused on creating genuine opportunities.
            </p>

          </div>


          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            <ValueCard
              icon={<Heart size={25} />}
              title="Compassion"
              text="We serve people with care, dignity, empathy, and respect."
            />

            <ValueCard
              icon={<ShieldCheck size={25} />}
              title="Integrity"
              text="We value honesty, accountability, responsibility, and trust."
            />

            <ValueCard
              icon={<Users size={25} />}
              title="Togetherness"
              text="We believe lasting change grows through community collaboration."
            />

            <ValueCard
              icon={<Lightbulb size={25} />}
              title="Empowerment"
              text="We help people gain knowledge, skills, confidence, and opportunity."
            />

          </div>

        </div>
      </section>


      {/* =========================================================
          6. EDUCATION SECTION
      ========================================================= */}
      <section className="px-6 py-24 lg:px-8">

        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">

          {/* TEXT */}
          <div>

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
              Education & Opportunity
            </span>

            <h2 className="mt-4 text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
              Education is one of the
              <span className="block text-blue-700">
                strongest paths to hope.
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Education can open doors that poverty tries to close. We work
              toward helping vulnerable students continue learning and
              developing the knowledge and skills they need for their future.
            </p>

            <div className="mt-8 space-y-5">

              <EducationPoint
                icon={<GraduationCap size={22} />}
                title="School Support"
                text="Helping students overcome barriers to staying in school."
              />

              <EducationPoint
                icon={<BookOpen size={22} />}
                title="Learning Materials"
                text="Supporting access to essential educational resources."
              />

              <EducationPoint
                icon={<Laptop size={22} />}
                title="Digital Skills"
                text="Introducing young people to computer and digital skills."
              />

            </div>

          </div>


          {/* IMAGE */}
          <div className="relative">

            <img
              src="/images/education1.jpg"
              alt="Education support"
              className="h-[560px] w-full rounded-[2rem] object-cover shadow-2xl"
            />

            <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white p-6 shadow-2xl">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <BookOpen size={24} />
                </div>

                <div>
                  <p className="font-black text-slate-900">
                    Learning creates opportunity.
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Every student deserves a chance to learn.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          7. IMPACT / STUDENTS
      ========================================================= */}
      <section className="bg-slate-950 px-6 py-24 text-white lg:px-8">

        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">

          {/* IMAGE */}
          <div className="relative">

            <img
              src="/images/students2.jpg"
              alt="Students and education"
              className="h-[540px] w-full rounded-[2rem] object-cover shadow-2xl"
            />

            <div className="absolute left-6 top-6 rounded-2xl bg-white px-5 py-4 text-slate-900 shadow-xl">

              <div className="flex items-center gap-3">

                <GraduationCap className="text-blue-700" size={25} />

                <div>
                  <p className="font-black">
                    Every student matters
                  </p>

                  <p className="text-xs text-slate-500">
                    Education • Hope • Future
                  </p>
                </div>

              </div>

            </div>

          </div>


          {/* TEXT */}
          <div>

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
              Our Impact
            </span>

            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
              Supporting students
              <span className="block text-blue-300">
                beyond the classroom.
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              Our goal is not simply to provide assistance. We want students
              to have the confidence, skills, support, and opportunities they
              need to continue building their future.
            </p>

            <div className="mt-9 grid gap-5 sm:grid-cols-2">

              <ImpactCard
                icon={<GraduationCap size={24} />}
                title="Education"
                text="Supporting access to learning."
              />

              <ImpactCard
                icon={<Laptop size={24} />}
                title="Skills"
                text="Developing practical digital skills."
              />

              <ImpactCard
                icon={<Heart size={24} />}
                title="Well-being"
                text="Promoting care and support."
              />

              <ImpactCard
                icon={<Users size={24} />}
                title="Mentorship"
                text="Building confidence and direction."
              />

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          8. HOW WE WORK
      ========================================================= */}
      <section className="px-6 py-24 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
              Our Approach
            </span>

            <h2 className="mt-4 text-4xl font-black text-slate-900 sm:text-5xl">
              How we turn hope into action
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              We focus on understanding needs, providing practical support,
              and creating pathways toward greater independence.
            </p>

          </div>


          <div className="mt-14 grid gap-6 md:grid-cols-4">

            <Step
              number="01"
              title="Listen"
              text="Understand the needs of students, families, and communities."
            />

            <Step
              number="02"
              title="Support"
              text="Connect people with practical educational and social support."
            />

            <Step
              number="03"
              title="Empower"
              text="Build knowledge, skills, confidence, and opportunities."
            />

            <Step
              number="04"
              title="Grow"
              text="Work together to create stronger and more resilient communities."
            />

          </div>

        </div>
      </section>


      {/* =========================================================
          9. FOUNDER
      ========================================================= */}
      <section className="bg-blue-50 px-6 py-24 lg:px-8">

        <div className="mx-auto max-w-6xl">

          <div className="mb-12 text-center">

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
              Leadership
            </span>

            <h2 className="mt-4 text-4xl font-black text-slate-900 sm:text-5xl">
              Meet Our Founder
            </h2>

          </div>


          <div className="grid overflow-hidden rounded-[2rem] bg-white shadow-2xl md:grid-cols-2">

            {/* FOUNDER IMAGE */}
            <div className="min-h-[520px]">

              <img
                src="/images/founder.jpg"
                alt="Muringa Jean de Dieu - Founder"
                className="h-full w-full object-cover"
              />

            </div>


            {/* FOUNDER MESSAGE */}
            <div className="flex flex-col justify-center p-8 sm:p-12">

              <Quote
                size={45}
                className="text-blue-200"
              />

              <p className="mt-5 text-xl italic leading-8 text-slate-600">
                “At ITEME of HOPE FAMILY ORGANIZATION, we believe every child
                deserves the opportunity to learn, grow, and achieve their
                dreams.”
              </p>

              <p className="mt-5 leading-7 text-slate-600">
                Our mission is to restore hope through education, empower
                vulnerable families, and build stronger communities. Together,
                we can make a lasting difference one child, one family, and one
                community at a time.
              </p>

              <div className="mt-8 border-t border-slate-100 pt-6">

                <h3 className="text-2xl font-black text-slate-900">
                  Muringa Jean de Dieu
                </h3>

                <p className="mt-1 font-bold text-blue-700">
                  Founder & Visionary Leader
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  ITEME of HOPE FAMILY ORGANIZATION
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          10. PARTNERSHIP / COMMUNITY
      ========================================================= */}
      <section className="px-6 py-24 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="rounded-[2rem] bg-slate-50 p-8 sm:p-12">

            <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">

              <div>

                <div className="flex items-center gap-3 text-blue-700">

                  <Globe2 size={27} />

                  <span className="text-sm font-bold uppercase tracking-[0.2em]">
                    Together We Can
                  </span>

                </div>

                <h2 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
                  Change grows when communities work together.
                </h2>

                <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                  We welcome volunteers, donors, schools, community leaders,
                  organizations, and partners who share our commitment to
                  supporting vulnerable students and families.
                </p>

              </div>

              <Link
                to="/contact"
                className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-700 px-6 py-3.5 font-bold text-white transition hover:bg-blue-800"
              >
                Partner With Us
                <ArrowRight size={18} />
              </Link>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          11. FINAL CTA
      ========================================================= */}
      <section className="px-6 pb-24 lg:px-8">

        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 px-7 py-16 text-center text-white shadow-2xl sm:px-12">

          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full border border-white/10" />

          <div className="relative">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
              <HandHeart size={32} />
            </div>

            <h2 className="mt-7 text-4xl font-black sm:text-5xl">
              Help us build a brighter future.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
              Your support can help vulnerable students access education,
              develop skills, and move toward a future filled with opportunity.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4">

              <Link
                to="/donate"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-bold text-blue-900 transition hover:bg-blue-50"
              >
                Support Our Mission
                <Heart size={18} />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-4 font-bold transition hover:bg-white/20"
              >
                Contact Us
                <ArrowRight size={18} />
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
};


/* =============================================================
   COMPONENTS
============================================================= */

const StoryPoint = ({ text }) => (
  <div className="flex items-center gap-3">

    <CheckCircle2
      size={20}
      className="shrink-0 text-blue-700"
    />

    <span className="font-medium text-slate-700">
      {text}
    </span>

  </div>
);


const ValueCard = ({ icon, title, text }) => (
  <div className="group rounded-3xl border border-slate-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
      {icon}
    </div>

    <h3 className="mt-6 text-xl font-black text-slate-900">
      {title}
    </h3>

    <p className="mt-3 leading-7 text-slate-600">
      {text}
    </p>

  </div>
);


const EducationPoint = ({ icon, title, text }) => (
  <div className="flex gap-4">

    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
      {icon}
    </div>

    <div>

      <h3 className="font-black text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-6 text-slate-600">
        {text}
      </p>

    </div>

  </div>
);


const ImpactCard = ({ icon, title, text }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">

    <div className="text-blue-300">
      {icon}
    </div>

    <h3 className="mt-4 font-black">
      {title}
    </h3>

    <p className="mt-1 text-sm leading-6 text-slate-400">
      {text}
    </p>

  </div>
);


const Step = ({ number, title, text }) => (
  <div className="relative rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">

    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-700 text-sm font-black text-white">
      {number}
    </div>

    <h3 className="mt-6 text-xl font-black text-slate-900">
      {title}
    </h3>

    <p className="mt-3 leading-7 text-slate-600">
      {text}
    </p>

  </div>
);


export default About;

