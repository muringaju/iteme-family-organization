import { useEffect, useState } from "react";
import {
  Users,
  HeartHandshake,
  X,
  Send,
  Loader2,
  Mail,
  Phone,
  CalendarDays,
  UserRound,
  ShieldCheck,
  HandHeart,
  Quote,
} from "lucide-react";

import api from "../api/axios.js";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // SUPPORT US STATE
  // =====================================================

  const [showSupportForm, setShowSupportForm] = useState(false);
  const [sendingSupport, setSendingSupport] = useState(false);

  const [supportForm, setSupportForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // =====================================================
  // FETCH MEMBERS
  // =====================================================

  async function fetchMembers() {
    try {
      setLoading(true);

      const response = await api.get("/members");

      if (Array.isArray(response.data)) {
        setMembers(response.data);
      } else if (Array.isArray(response.data?.data)) {
        setMembers(response.data.data);
      } else {
        setMembers([]);
      }
    } catch (error) {
      console.error("Members fetch error:", error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMembers();
  }, []);

  // =====================================================
  // SUPPORT FORM
  // =====================================================

  function handleSupportChange(e) {
    const { name, value } = e.target;

    setSupportForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function openSupportForm() {
    setSupportForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

    setShowSupportForm(true);
  }

  function closeSupportForm() {
    if (sendingSupport) return;

    setShowSupportForm(false);

    setSupportForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  }

  // =====================================================
  // SEND SUPPORT MESSAGE
  // =====================================================

  async function handleSupportSubmit(e) {
    e.preventDefault();

    if (!supportForm.name.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!supportForm.email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    if (!supportForm.message.trim()) {
      alert("Please tell us how you would like to support ITEME.");
      return;
    }

    try {
      setSendingSupport(true);

      const response = await api.post("/messages", {
        name: supportForm.name.trim(),
        email: supportForm.email.trim(),
        subject:
          supportForm.subject.trim() ||
          "Support ITEME of HOPE FAMILY ORGANIZATION",
        message: supportForm.message.trim(),
      });

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Unable to send your support message."
        );
      }

      alert(
        "Thank you for your willingness to support ITEME of HOPE FAMILY ORGANIZATION. Your message has been received successfully."
      );

      setSupportForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      setShowSupportForm(false);
    } catch (error) {
      console.error("Support message error:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to send your message. Please try again."
      );
    } finally {
      setSendingSupport(false);
    }
  }

  // =====================================================
  // SUPPORT MODAL
  // =====================================================

  function SupportModal() {
    if (!showSupportForm) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
        <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

          {/* HEADER */}
          <div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-100 bg-white px-6 py-5 sm:px-8">
            <div className="flex gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-forest/10 text-forest">
                <HandHeart size={25} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-forest-dark sm:text-2xl">
                  Support Us
                </h2>

                <p className="mt-1 max-w-md text-sm leading-6 text-gray-500">
                  Join us in creating hope, opportunity and a brighter
                  future for vulnerable children.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeSupportForm}
              disabled={sendingSupport}
              className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed"
              aria-label="Close support form"
            >
              <X size={22} />
            </button>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSupportSubmit}
            className="space-y-5 px-6 py-6 sm:px-8"
          >
            {/* INTRO */}
            <div className="rounded-2xl bg-forest/5 p-5">
              <div className="flex gap-3">
                <HeartHandshake
                  size={22}
                  className="mt-1 shrink-0 text-forest"
                />

                <p className="text-sm leading-6 text-gray-600">
                  Your support can make a meaningful difference in the
                  lives of vulnerable children and families. You can
                  support us through donations, volunteering, school
                  materials, skills, partnerships, mentorship or other
                  contributions.
                </p>
              </div>
            </div>

            {/* NAME + EMAIL */}
            <div className="grid gap-5 sm:grid-cols-2">

              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Full Name *
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={supportForm.name}
                    onChange={handleSupportChange}
                    placeholder="Your full name"
                    required
                    className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/10"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email Address *
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={supportForm.email}
                    onChange={handleSupportChange}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/10"
                  />
                </div>
              </div>
            </div>

            {/* SUPPORT TYPE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                How would you like to support us?
              </label>

              <select
                name="subject"
                value={supportForm.subject}
                onChange={handleSupportChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/10"
              >
                <option value="">
                  Select a support option
                </option>

                <option value="Financial Donation">
                  Financial Donation
                </option>

                <option value="School Materials">
                  School Materials
                </option>

                <option value="Food and Nutrition Support">
                  Food and Nutrition Support
                </option>

                <option value="Education Sponsorship">
                  Education Sponsorship
                </option>

                <option value="Volunteer">
                  Volunteer
                </option>

                <option value="Mentorship">
                  Mentorship
                </option>

                <option value="Skills and Professional Support">
                  Skills and Professional Support
                </option>

                <option value="Partnership">
                  Partnership
                </option>

                <option value="Other Support">
                  Other Support
                </option>
              </select>
            </div>

            {/* MESSAGE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Tell us how you would like to support us *
              </label>

              <textarea
                name="message"
                value={supportForm.message}
                onChange={handleSupportChange}
                rows={6}
                required
                placeholder="Tell us how you would like to support ITEME of HOPE FAMILY ORGANIZATION..."
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 leading-6 outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/10"
              />

              <p className="mt-2 text-xs text-gray-400">
                Please provide any useful details about your contribution,
                availability or partnership idea.
              </p>
            </div>

            {/* PRIVACY */}
            <div className="flex gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-forest"
              />

              <p className="text-xs leading-5 text-gray-500">
                Your information will be used only to contact you about
                your support and possible partnership with ITEME of HOPE
                FAMILY ORGANIZATION.
              </p>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={closeSupportForm}
                disabled={sendingSupport}
                className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={sendingSupport}
                className="flex items-center justify-center gap-2 rounded-xl bg-forest px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sendingSupport ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Support Message
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="bg-forest-dark px-6 py-16 text-white sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-3xl">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              <Users size={17} />
              Our Community
            </div>

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Together, We Create
              <span className="block text-emerald-200">
                Hope and Opportunity
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              Our members, volunteers, partners and supporters are
              helping ITEME of HOPE FAMILY ORGANIZATION build stronger
              communities and brighter futures for vulnerable children.
            </p>

            <div className="mt-8">
              <button
                type="button"
                onClick={openSupportForm}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-forest shadow-lg transition hover:bg-gray-100"
              >
                <HandHeart size={19} />
                Support Us
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* =================================================
          PEOPLE BEHIND THE MISSION
      ================================================= */}

      <section className="px-6 py-14 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-forest">
                Our Members
              </p>

              <h2 className="mt-2 text-3xl font-bold text-forest-dark sm:text-4xl">
                People Behind the Mission
              </h2>

              <p className="mt-3 max-w-2xl text-gray-500">
                Meet the people contributing their time, skills and
                resources to support our mission and create opportunities
                for vulnerable children.
              </p>
            </div>

            <button
              type="button"
              onClick={openSupportForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-forest-dark"
            >
              <HandHeart size={18} />
              Support Us
            </button>

          </div>

          {/* LOADING */}
          {loading ? (
            <div className="flex min-h-[250px] items-center justify-center">
              <Loader2
                size={34}
                className="animate-spin text-forest"
              />
            </div>
          ) : members.length === 0 ? (

            <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">

              <Users
                size={50}
                className="mx-auto mb-4 text-gray-300"
              />

              <h3 className="text-xl font-bold text-gray-700">
                No Members Available
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                Member information will appear here when members are
                registered.
              </p>

            </div>

          ) : (

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {members.map((member) => (

                <div
                  key={member._id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  {/* IMAGE */}
                  <div className="aspect-square overflow-hidden bg-gray-100">

                    {member.image ? (

                      <img
                        src={
                          member.image.startsWith("http")
                            ? member.image
                            : `http://localhost:5001${member.image}`
                        }
                        alt={member.name || "Member"}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />

                    ) : (

                      <div className="grid h-full w-full place-items-center bg-forest/5">
                        <UserRound
                          size={70}
                          className="text-forest/30"
                        />
                      </div>

                    )}

                  </div>

                  {/* CONTENT */}
                  <div className="p-5">

                    {/* NAME */}
                    <h3 className="text-xl font-bold text-forest-dark">
                      {member.name || "Member"}
                    </h3>

                    {/* MEMBERSHIP */}
                    {member.membershipType && (
                      <span className="mt-2 inline-flex rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest">
                        {member.membershipType}
                      </span>
                    )}

                    {/* CONTACT */}
                    {member.contact && (
                      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                        <Phone
                          size={15}
                          className="shrink-0 text-forest"
                        />
                        <span>{member.contact}</span>
                      </div>
                    )}

                    {/* EMAIL */}
                    {member.email && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                        <Mail
                          size={15}
                          className="shrink-0 text-forest"
                        />

                        <span className="truncate">
                          {member.email}
                        </span>
                      </div>
                    )}

                    {/* JOINED DATE */}
                    {member.joinedDate && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                        <CalendarDays
                          size={15}
                          className="shrink-0"
                        />

                        <span>
                          Joined{" "}
                          {new Date(
                            member.joinedDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {/* WHY I JOINED */}
                    {member.reason && (
                      <div className="mt-5 rounded-2xl bg-forest/5 p-4">

                        <div className="flex items-center gap-2">
                          <Quote
                            size={17}
                            className="text-forest"
                          />

                          <p className="text-xs font-bold uppercase tracking-wider text-forest">
                            Why I Joined
                          </p>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-gray-600">
                          “{member.reason}”
                        </p>

                      </div>
                    )}

                  </div>
                </div>

              ))}

            </div>

          )}

        </div>
      </section>

      {/* =================================================
          SUPPORT CTA
      ================================================= */}

      <section className="px-6 pb-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">

          <div className="overflow-hidden rounded-3xl bg-forest-dark px-6 py-10 text-white shadow-xl sm:px-10 lg:px-14">

            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

              <div className="max-w-2xl">

                <div className="mb-3 flex items-center gap-2 text-emerald-200">

                  <HandHeart size={22} />

                  <span className="text-sm font-bold uppercase tracking-wider">
                    Support Our Mission
                  </span>

                </div>

                <h2 className="text-2xl font-bold sm:text-3xl">
                  Be Part of the Change
                </h2>

                <p className="mt-3 leading-7 text-white/70">
                  Every contribution matters. Whether you give your
                  time, skills, resources, school materials, financial
                  support or partnership, you can help us create better
                  opportunities for vulnerable children.
                </p>

              </div>

              <button
                type="button"
                onClick={openSupportForm}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-forest transition hover:bg-gray-100"
              >
                <HeartHandshake size={19} />
                Support Us
              </button>

            </div>

          </div>

        </div>
      </section>

      {/* =================================================
          SUPPORT MODAL
      ================================================= */}

      <SupportModal />

    </div>
  );
}

