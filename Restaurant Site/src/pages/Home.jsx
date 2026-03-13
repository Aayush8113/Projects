// src/pages/Home.jsx
import React, { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChefHat,
  Star,
  MapPin,
  Phone,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import heroImg from "../assets/gallary/hero.jpg";

/**
 * Lazy-load heavier sections for better first paint.
 * Keep filenames as-is in your components folder.
 */
const WhyChooseUs = lazy(() =>
  import(/* webpackChunkName: "why-choose-us" */ "../components/WhyChooseUs")
);
const TestimonialsSlider = lazy(() =>
  import(
    /* webpackChunkName: "testimonials-slider" */ "../components/Testimonials"
  )
);

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="text-gray-100">
      {/* ================= HERO ================= */}
      <section
        id="home"
        aria-label="Hero"
        className="relative min-h-screen overflow-hidden"
      >
        {/* Background image layers */}
        <div className="absolute inset-0" aria-hidden>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 animate-[zoomIn_15s_ease-in-out_infinite_alternate]"
            style={{ backgroundImage: `url(${heroImg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative min-h-screen flex items-center px-6 md:px-10 lg:px-16 py-20 sm:py-28">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              {/* Left: copy */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-left space-y-6"
              >
                <Badge />
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
                  Welcome to
                  <span className="block text-amber-400 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                    La Mansa
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto lg:mx-0">
                  Experience authentic Italian cuisine crafted with passion and
                  tradition.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <PrimaryCTA onClick={() => navigate("/menu")} />
                  <button
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    onClick={() =>
                      document
                        .getElementById("reservation")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    aria-label="Reserve a table"
                  >
                    Reserve a Table
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 justify-center lg:justify-start text-sm mt-4">
                  <InfoBox
                    icon={<Star className="text-amber-400" aria-hidden />}
                    text="4.9/5 (500+ Reviews)"
                  />
                  <InfoBox
                    icon={<MapPin className="text-amber-400" aria-hidden />}
                    text="NYC Location"
                  />
                  <InfoBox
                    icon={<Phone className="text-amber-400" aria-hidden />}
                    text="(123) 456-7890"
                  />
                </div>
              </motion.div>

              {/* Right: stats / card */}
              <div className="hidden lg:block">
                <motion.aside
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="bg-white/6 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-xl max-w-md ml-auto"
                >
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Experience Excellence
                  </h3>

                  <StatsRow label="Years of Excellence" value="25+" />
                  <StatsRow label="Happy Customers" value="50K+" />
                  <StatsRow label="Awards Won" value="12+" />
                  <StatsRow label="Signature Dishes" value="45+" />

                  <div className="mt-6 pt-4 border-t border-white/8 flex items-center gap-3 text-white">
                    <Sparkles className="text-amber-400" aria-hidden />
                    <span>Open Today: 11AM - 11PM</span>
                  </div>
                </motion.aside>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator (keyboard accessible) */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <button
            onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
            className="w-5 h-10 border-2 border-white rounded-full relative inline-flex items-start justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Scroll to about"
          >
            <span className="w-1 h-1 bg-white absolute top-2 rounded-full" />
          </button>
        </motion.div>

        <style>{`
          @keyframes zoomIn {
            from { transform: scale(1.1); }
            to { transform: scale(1.2); }
          }
        `}</style>
      </section>

      {/* ================= ABOUT / INTRO ================= */}
      <section id="about" aria-label="About La Mansa" className="py-16 px-6 md:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Story
            </h2>
            <p className="text-gray-300 leading-relaxed">
              La Mansa blends classic Italian roots with contemporary flavors.
              Founded in 1998, we craft each dish using seasonal ingredients,
              traditional techniques, and a passion for hospitality.
            </p>

            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <li className="flex items-start gap-3">
                <Star className="text-amber-400 mt-1" />
                <span className="text-gray-300">Handpicked ingredients</span>
              </li>
              <li className="flex items-start gap-3">
                <ChefHat className="text-amber-400 mt-1" />
                <span className="text-gray-300">Expert culinary team</span>
              </li>
            </ul>
          </div>

          <div aria-hidden className="rounded-xl overflow-hidden shadow-lg">
            {/* A subtle hero image card; replace with a dedicated about image if you have one */}
            <div
              className="w-full h-64 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImg})` }}
            />
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US (lazy) ================= */}
      <Suspense fallback={<SectionFallback title="Why Choose Us" />}>
        <WhyChooseUs />
      </Suspense>

      {/* ================= TESTIMONIALS (lazy) ================= */}
      <Suspense fallback={<SectionFallback title="Customer Testimonials" />}>
        <TestimonialsSlider />
      </Suspense>

      {/* ================= RESERVATION CTA ================= */}
      <section
        id="reservation"
        aria-label="Reservation call to action"
        className="py-12 px-6 md:px-10 lg:px-16 bg-gray-900/60"
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white">Book a Table</h3>
            <p className="text-gray-300">
              Reserve your spot and enjoy an unforgettable dining experience.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/reservationForm")}
              className="bg-amber-500 text-black px-6 py-3 rounded-full font-semibold hover:opacity-95 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              Reserve Now
            </button>
            <a
              href="/menu"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-full border border-white/10 hover:bg-white/5 transition text-white"
            >
              View Menu
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* NOTE: Footer is left to your global layout/footer component */}
    </main>
  );
}

/* ----------------- Helper & small components ----------------- */

function Badge() {
  return (
    <div
      className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 px-4 py-2 rounded-full"
      aria-hidden
    >
      <ChefHat className="text-amber-400 w-5 h-5" />
      <span className="text-amber-300 text-sm font-medium">EST. 1998</span>
    </div>
  );
}

function PrimaryCTA({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black px-6 py-3 rounded-full font-bold shadow-lg hover:opacity-95 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      aria-label="View menu"
    >
      View Menu
      <ChevronRight className="w-4 h-4" />
    </button>
  );
}

function InfoBox({ icon, text }) {
  return (
    <div className="flex items-center gap-2 bg-white/6 backdrop-blur-sm px-3 py-2 rounded-lg text-gray-200 text-sm">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function StatsRow({ label, value }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <span className="text-gray-300">{label}</span>
      <span className="text-3xl font-bold text-amber-400">{value}</span>
    </div>
  );
}

/* Simple fallback UI for lazy sections */
function SectionFallback({ title = "Loading..." }) {
  return (
    <section className="py-12 px-6 md:px-10 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-48 bg-white/6 rounded" />
          <div className="h-40 bg-white/4 rounded mt-3" />
        </div>
        <p className="mt-4 text-gray-400">{title} — loading…</p>
      </div>
    </section>
  );
}
