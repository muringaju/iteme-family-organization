import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Heart,
  Users,
  GraduationCap,
  HandHeart,
  BookOpen,
  ShieldCheck,
  Utensils,
  Laptop,
  School,
  Play,
  CheckCircle2,
  Sparkles,
  Quote,
  Target,
  Eye,
  ChevronRight,
} from "lucide-react";

const Home = () => {
  return (
    <main className="min-h-screen bg-white text-slate-800">

      {/* =========================================================
          HERO SECTION
      ========================================================= */}
      <section className="relative min-h-[680px] overflow-hidden">

        {/* Background image */}
        <img
          src="/images/hero.jpg"
          alt="ITEME community"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Dark blue overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-900/80 to-blue-900/30" />

        {/* Decorative circles */}
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10" />
        <div className="absolute -bottom-40 right-20 h-96 w-96 rounded-full border border-white/10" />

        <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-center px-6 py-20 lg:px-8">

          <div className="max-w-3xl text-white">

            {/* Badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold backdrop-blur-md">
              <Sparkles size={17} className="text-blue-200" />
              ITEME of HOPE FAMILY ORGANIZATION
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Every Child
              <span className="block text-blue-200">
                Deserves Hope.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-blue-50/90 sm:text-xl">
              We support vulnerable students and families through education,
              mentorship, skills development, food support, and community
              empowerment.
            </p>

            {/* Buttons */}
            <div className="mt-9 flex flex-wrap gap-4">

              <Link
                to="/donate"
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-bold text-blue-900 shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-blue-50"
              >
                <Heart size={19} className="transition group-hover:scale-110" />
                Support a Child
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                Discover Our Story
              </Link>

            </div>

            {/* Trust points */}
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-blue-100">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} />
                Education
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} />
                Community
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} />
                Empowerment
              </span>
            </div>

          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </section>


      {/* =========================================================
          STATS
      ========================================================= */}
      <section className="relative z-10 -mt-5 px-5">
        <div className="mx-auto grid max-w-6xl grid-cols-2 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl md:grid-cols-4">

          <Stat
            number="50+"
            label="Students to Support"
            icon={<GraduationCap size={22} />}
          />

          <Stat
            number="300+"
            label="Community Members"
            icon={<Users size={22} />}
          />

          <Stat
            number="10+"
            label="Community Activities"
            icon={<HandHeart size={22} />}
          />

          <Stat
            number="2024"
            label="Founded"
            icon={<Sparkles size={22} />}
          />

        </div>
      </section>


      {/* =========================================================
          ABOUT SECTION
      ========================================================= */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">

          {/* Images */}
          <div className="relative">

            <div className="grid grid-cols-2 gap-4">

              <img
                src="/images/students.jpg"
                alt="Students"
                className="h-72 w-full rounded-3xl object-cover shadow-lg"
              />

              <img
                src="/images/community.jpg"
                alt="Community"
                className="mt-12 h-72 w-full rounded-3xl object-cover shadow-lg"
              />

            </div>

            {/* Floating card */}
            <div className="absolute bottom-5 left-5 rounded-2xl bg-white p-5 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <Heart size={23} fill="currentColor" />
                </div>

                <div>
                  <p className="font-extrabold text-slate-900">
                    Hope in Action
                  </p>
                  <p className="text-sm text-slate-500">
                    Together we can help.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Text */}
          <div>

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
              Who We Are
            </span>

            <h2 className="mt-4 text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
              Turning compassion
              <span className="block text-blue-700">
                into opportunity.
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              ITEME of HOPE FAMILY ORGANIZATION is committed to creating
              opportunities for vulnerable students and families in Rwanda.
            </p>

            <p className="mt-4 leading-7 text-slate-600">
              Through education support, computer skills, mentorship,
              nutrition assistance, charity activities, and community
              empowerment, we work to build a future where young people can
              learn, grow, and succeed.
            </p>

            <div className="mt-7 space-y-4">

              <Feature text="Education and school support" />
              <Feature text="Skills and digital development" />
              <Feature text="Food and family support" />
              <Feature text="Community engagement and charity" />

            </div>

            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3.5 font-bold text-white transition hover:bg-blue-800"
            >
              Learn More
              <ArrowRight size={18} />
            </Link>

          </div>

        </div>
      </section>


      {/* =========================================================
          VIDEO SECTION
      ========================================================= */}
      <section className="bg-blue-950 px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">

          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* Video */}
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-2xl">

              <video
                controls
                poster="/images/hero.jpg"
                className="h-[430px] w-full object-cover"
              >
                <source
                  src="/images/impact-video.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>

              {/* Video badge */}
              <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-blue-900 shadow-lg">
                <Play size={15} fill="currentColor" />
                Our Story
              </div>

            </div>

            {/* Text */}
            <div>

              <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
                See Our Impact
              </span>

              <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
                Hope is more powerful
                <span className="block text-blue-300">
                  when we share it.
                </span>
              </h2>

              <p className="mt-6 text-lg leading-8 text-blue-100">
                Watch our story and discover how students, families,
                volunteers, and supporters come together to make a difference.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <GraduationCap className="text-blue-300" size={28} />
                  <h3 className="mt-3 font-bold">
                    Education
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-blue-100/70">
                    Helping students stay focused on their education.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <Users className="text-blue-300" size={28} />
                  <h3 className="mt-3 font-bold">
                    Community
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-blue-100/70">
                    Bringing people together around a common purpose.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          PROGRAMS
      ========================================================= */}
      <section className="bg-slate-50 px-6 py-24">
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
              What We Do
            </span>

            <h2 className="mt-4 text-4xl font-black text-slate-900 sm:text-5xl">
              Programs that create
              <span className="text-blue-700"> real change.</span>
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              Our programs focus on the needs that matter most to vulnerable
              students and families.
            </p>

          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            <Program
              icon={<GraduationCap size={27} />}
              title="Education Support"
              text="Helping vulnerable students access school fees, materials, uniforms, and other learning needs."
            />

            <Program
              icon={<Laptop size={27} />}
              title="Computer Skills"
              text="Teaching young people basic computer and digital skills for education and future opportunities."
            />

            <Program
              icon={<Utensils size={27} />}
              title="Food & Nutrition"
              text="Supporting vulnerable children and families with food and nutrition assistance."
            />

            <Program
              icon={<Users size={27} />}
              title="Mentorship"
              text="Providing guidance, encouragement, personal development, and positive role models."
            />

            <Program
              icon={<HandHeart size={27} />}
              title="Charity Week"
              text="Organizing activities that raise awareness, mobilize support, and bring communities together."
            />

            <Program
              icon={<School size={27} />}
              title="Community Empowerment"
              text="Working with communities to identify challenges and build sustainable opportunities."
            />

          </div>

        </div>
      </section>


      {/* =========================================================
          STUDENTS IMAGE FEATURE
      ========================================================= */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-blue-700 shadow-2xl lg:grid-cols-2">

          {/* Image */}
          <div className="min-h-[450px]">
            <img
              src="/images/students.jpg"
              alt="Vulnerable students"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Text */}
          <div className="flex flex-col justify-center p-8 text-white sm:p-12 lg:p-16">

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-200">
              Every Student Matters
            </span>

            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
              Education can change a life.
            </h2>

            <p className="mt-6 leading-8 text-blue-50">
              A child should not lose the opportunity to learn simply because
              their family is facing financial difficulties.
            </p>

            <div className="mt-8 space-y-4">

              <WhiteFeature text="School fees and educational assistance" />
              <WhiteFeature text="Learning materials and school supplies" />
              <WhiteFeature text="Mentorship and personal development" />
              <WhiteFeature text="Computer and digital skills" />

            </div>

            <Link
              to="/donate"
              className="mt-9 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-blue-800 transition hover:bg-blue-50"
            >
              Help a Student
              <ArrowRight size={18} />
            </Link>

          </div>

        </div>
      </section>


      {/* =========================================================
          COMMUNITY + CHARITY
      ========================================================= */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-7 md:grid-cols-2">

            {/* Community */}
            <div className="group relative h-[520px] overflow-hidden rounded-[2rem]">

              <img
                src="/images/community.jpg"
                alt="ITEME community"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/95 via-blue-950/30 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8 text-white sm:p-10">

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                  <Users size={24} />
                </div>

                <h3 className="text-3xl font-black">
                  Stronger Together
                </h3>

                <p className="mt-3 max-w-lg leading-7 text-blue-100">
                  Our community becomes stronger when people come together
                  to support children and families who need a helping hand.
                </p>

                <Link
                  to="/community"
                  className="mt-6 inline-flex items-center gap-2 font-bold"
                >
                  Our Community
                  <ChevronRight size={18} />
                </Link>

              </div>
            </div>


            {/* Charity */}
            <div className="group relative h-[520px] overflow-hidden rounded-[2rem]">

              <img
                src="/images/charity.jpg"
                alt="Charity activities"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/95 via-blue-950/30 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8 text-white sm:p-10">

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                  <Heart size={24} />
                </div>

                <h3 className="text-3xl font-black">
                  Charity in Action
                </h3>

                <p className="mt-3 max-w-lg leading-7 text-blue-100">
                  Through Charity Week and community activities, we transform
                  generosity into practical support for people in need.
                </p>

                <Link
                  to="/charity-week"
                  className="mt-6 inline-flex items-center gap-2 font-bold"
                >
                  Explore Charity Week
                  <ChevronRight size={18} />
                </Link>

              </div>
            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          FAMILY SECTION
      ========================================================= */}
      <section className="bg-blue-50 px-6 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">

          <div className="order-2 lg:order-1">

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
              Family & Community
            </span>

            <h2 className="mt-4 text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
              Supporting families,
              <span className="block text-blue-700">
                strengthening futures.
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              We believe that supporting a child also means understanding
              the family and community around them.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              <MiniCard
                icon={<ShieldCheck size={23} />}
                title="Care"
                text="Creating safer and stronger support systems."
              />

              <MiniCard
                icon={<BookOpen size={23} />}
                title="Education"
                text="Opening doors through learning."
              />

              <MiniCard
                icon={<Heart size={23} />}
                title="Compassion"
                text="Serving people with dignity and respect."
              />

              <MiniCard
                icon={<Target size={23} />}
                title="Opportunity"
                text="Helping young people build their future."
              />

            </div>

          </div>

          <div className="order-1 lg:order-2">

            <img
              src="/images/family.jpg"
              alt="Family support"
              className="h-[540px] w-full rounded-[2rem] object-cover shadow-2xl"
            />

          </div>

        </div>
      </section>


      {/* =========================================================
          FOUNDER
      ========================================================= */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">

          <div className="mb-12 text-center">

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
              Leadership
            </span>

            <h2 className="mt-4 text-4xl font-black text-slate-900 sm:text-5xl">
              Meet Our Founder
            </h2>

          </div>

          <div className="grid overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-2xl md:grid-cols-2">

            <div className="min-h-[500px]">
              <img
                src="/images/founder.jpg"
                alt="Muringa Jean de Dieu"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center p-8 sm:p-12">

              <Quote size={42} className="text-blue-200" />

              <p className="mt-5 text-xl italic leading-8 text-slate-600">
                "We rise by lifting others. When we give a child an
                opportunity, we help build a better future for everyone."
              </p>

              <div className="mt-8">

                <h3 className="text-2xl font-black text-slate-900">
                  Muringa Jean de Dieu
                </h3>

                <p className="mt-1 font-bold text-blue-700">
                  Founder
                </p>

                <p className="mt-5 leading-7 text-slate-600">
                  Founder of ITEME of HOPE FAMILY ORGANIZATION, committed to
                  empowering vulnerable students through education,
                  compassion, skills development, and community service.
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          MISSION / VISION
      ========================================================= */}
      <section className="bg-slate-950 px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">

          <div className="mb-14 text-center">

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
              Our Direction
            </span>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              What drives us
            </h2>

          </div>

          <div className="grid gap-7 md:grid-cols-2">

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 sm:p-10">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600">
                <Target size={27} />
              </div>

              <h3 className="mt-7 text-2xl font-black">
                Our Mission
              </h3>

              <p className="mt-4 leading-8 text-slate-300">
                To create opportunities for underprivileged children to
                access quality education, develop useful skills, and build
                brighter futures.
              </p>

            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 sm:p-10">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600">
                <Eye size={27} />
              </div>

              <h3 className="mt-7 text-2xl font-black">
                Our Vision
              </h3>

              <p className="mt-4 leading-8 text-slate-300">
                A community where every vulnerable student has the
                opportunity, support, and confidence to reach their full
                potential.
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="px-6 py-24">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 px-7 py-16 text-center text-white shadow-2xl sm:px-12">

          {/* Decorative shapes */}
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full border border-white/10" />

          <div className="relative">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
              <Heart size={31} />
            </div>

            <h2 className="mt-7 text-4xl font-black sm:text-5xl">
              You can help change a life.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
              Your support can help a vulnerable student remain in school,
              receive learning materials, develop skills, and believe in a
              brighter future.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4">

              <Link
                to="/donate"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-bold text-blue-900 shadow-lg transition hover:-translate-y-1 hover:bg-blue-50"
              >
                <Heart size={18} />
                Donate Now
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-4 font-bold backdrop-blur transition hover:bg-white/20"
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

const Stat = ({ number, label, icon }) => {
  return (
    <div className="border-b border-slate-100 p-6 text-center last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">

      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
        {icon}
      </div>

      <div className="mt-3 text-3xl font-black text-blue-700">
        {number}
      </div>

      <p className="mt-1 text-sm font-medium text-slate-500">
        {label}
      </p>

    </div>
  );
};


const Feature = ({ text }) => {
  return (
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
};


const WhiteFeature = ({ text }) => {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2
        size={20}
        className="shrink-0 text-blue-200"
      />

      <span className="text-sm font-medium text-white">
        {text}
      </span>
    </div>
  );
};


const Program = ({ icon, title, text }) => {
  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-100 hover:shadow-xl">

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition duration-300 group-hover:bg-blue-700 group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-black text-slate-900">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-600">
        {text}
      </p>

      <div className="mt-6 flex items-center gap-2 text-sm font-bold text-blue-700">
        Learn More
        <ArrowRight
          size={16}
          className="transition group-hover:translate-x-1"
        />
      </div>

    </div>
  );
};


const MiniCard = ({ icon, title, text }) => {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
        {icon}
      </div>

      <h3 className="mt-4 font-black text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>
    </div>
  );
};


export default Home;