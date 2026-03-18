import { Link } from "react-router-dom";
import donation from "../assets/donation.png";
import {
  FaHeartbeat,
  FaUserCheck,
  FaGlobeAsia,
  FaClipboardList,
  FaUserPlus,
  FaHandsHelping,
  FaHeart,
} from "react-icons/fa";

export default function Home() {
  return (
    <div className="bg-[#fafafa] text-gray-800 overflow-x-hidden">
      {/* ================= 1. HERO ================= */}
      {/* Removed min-h-screen and flex items-center to close gaps */}
      <section className="bg-gradient-to-br from-red-50 via-white to-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-10 pb-0 flex flex-col md:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Donate Blood <br />
              <span className="text-red-500">Save Lives ❤️</span>
            </h1>

            <p className="text-gray-600 mb-8 text-lg max-w-lg mx-auto md:mx-0">
              Your small action can create a big impact.
            </p>

            <div className="flex gap-4 justify-center md:justify-start">
              <Link
                to="/register"
                className="bg-red-500 text-white px-7 py-3 rounded-full hover:bg-red-600 hover:scale-105 transition shadow-md"
              >
                Become Donor
              </Link>
              <Link
                to="/search"
                className="border-2 border-gray-200 px-7 py-3 rounded-full hover:border-red-500 hover:text-red-500 hover:scale-105 transition"
              >
                Find Blood
              </Link>
            </div>
          </div>

          {/* Image Content */}
          <div className="relative group flex-1 flex justify-center">
            {/* Glow Effect */}
            <div className="absolute w-72 h-72 bg-red-300 blur-[120px] opacity-30 rounded-full group-hover:scale-110 transition duration-500"></div>

            {/* Image */}
            <img
              src={donation}
              alt="Blood Donation"
              className="w-full max-w-sm md:max-w-md relative z-10 group-hover:scale-105 transition duration-300"
            />
          </div>
        </div>
      </section>

      {/* ================= 2. QUICK ACTION ================= */}
      {/* Removed top padding (pt-0) to bridge the gap with Hero section */}
      <section className="pt-12 pb-24 text-center">
        <SectionTitle title="Quick Actions" />
        <div className="max-w-4xl mx-auto space-y-6">
          <GlassCard
            title="Search Blood"
            desc="Find donors instantly"
            link="/search"
          />
          <GlassCard
            title="Become Donor"
            desc="Join community"
            link="/register"
          />
          <GlassCard
            title="Emergency Help"
            desc="Urgent support"
            link="/request"
          />
        </div>
      </section>

      {/* ================= 3. FEATURES ================= */}
      <section className="py-24 bg-white text-center">
        <SectionTitle title="Why Choose Us" />
        <div className="max-w-4xl mx-auto space-y-6">
          <ModernCard
            icon={<FaHeartbeat />}
            title="Fast Response"
            desc="Quick matching system"
          />
          <ModernCard
            icon={<FaUserCheck />}
            title="Verified Donors"
            desc="Trusted users"
          />
          <ModernCard
            icon={<FaGlobeAsia />}
            title="Nationwide"
            desc="Available everywhere"
          />
        </div>
      </section>

      {/* ================= 4. HOW IT WORKS ================= */}
      <section className="py-24 text-center bg-gray-50">
        <SectionTitle title="How It Works" />
        <div className="max-w-3xl mx-auto space-y-6">
          <StepCard number="1" icon={<FaUserPlus />} title="Register" />
          <StepCard
            number="2"
            icon={<FaClipboardList />}
            title="Request Blood"
          />
          <StepCard number="3" icon={<FaHandsHelping />} title="Match Donor" />
          <StepCard number="4" icon={<FaHeart />} title="Donate" />
        </div>
      </section>

      {/* ================= 5. BLOOD GROUP ================= */}
      <section className="py-24 text-center">
        <SectionTitle title="Blood Groups" />
        <div className="flex flex-wrap justify-center gap-4">
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((b) => (
            <div
              key={b}
              className="px-6 py-3 bg-white rounded-full shadow hover:bg-red-500 hover:text-white hover:scale-110 transition"
            >
              {b}
            </div>
          ))}
        </div>
      </section>

      {/* ================= 6. TESTIMONIAL ================= */}
      <section className="py-24 bg-white text-center">
        <SectionTitle title="Donor Stories" />

        <div className="flex flex-col md:flex-row md:justify-center md:space-x-6 space-y-6 md:space-y-0 px-4">
          {/* Testimonial Card */}
          <div className="flex-1 max-w-md bg-white p-8 rounded-2xl shadow hover:shadow-2xl transition hover:-translate-y-1 duration-300">
            <p className="italic text-gray-600">
              "I donated blood and helped save a life. Best feeling ever!"
            </p>
            <h4 className="mt-4 text-red-500 font-bold">— Fatima S. <br /> — Donor</h4>
          </div>

          <div className="flex-1 max-w-md bg-white p-8 rounded-2xl shadow hover:shadow-2xl transition hover:-translate-y-1 duration-300">
            <p className="italic text-gray-600">
              "Assisting at the blood camp was one of the best experiences I've had. Seeing people leave smiling after donating is priceless."
            </p>
            <h4 className="mt-4 text-red-500 font-bold">— Rohan D. <br /> — Volunteer</h4>
          </div>

          <div className="flex-1 max-w-md bg-white p-8 rounded-2xl shadow hover:shadow-2xl transition hover:-translate-y-1 duration-300">
            <p className="italic text-gray-600">
              "Donating blood for the first time was nerve-wracking, but the staff made me feel comfortable. Knowing I saved a life is priceless!"
            </p>
            <h4 className="mt-4 text-red-500 font-bold">—Ahmed R. <br /> — Donor</h4>
          </div>
        </div>
      </section>

      {/* ================= 7. FAQ ================= */}
      <section className="py-24 bg-gray-50 text-center">
        <SectionTitle title="FAQs" />
        <div className="max-w-xl mx-auto space-y-4 text-left">
          <FaqItem q="Is blood donation safe?" />
          <FaqItem q="How often can I donate?" />
          <FaqItem q="Who can donate blood?" />
        </div>
      </section>

      {/* ================= 8. CTA ================= */}
      <section className="py-24 bg-gradient-to-r from-red-500 to-red-600 text-white text-center">
        <h2 className="text-4xl font-bold mb-6">Be Someone’s Hero </h2>
        <Link
          to="/register"
          className="bg-white text-red-500 px-8 py-3 rounded-full hover:scale-110 transition"
        >
          Join Now
        </Link>
      </section>
    </div>
  );
}

/* COMPONENTS */

const SectionTitle = ({ title }) => (
  <div className="mb-12">
    <h2 className="text-4xl font-bold">{title}</h2>
    <div className="w-20 h-1 bg-red-500 mx-auto mt-4"></div>
  </div>
);

const GlassCard = ({ title, desc, link }) => (
  <Link
    to={link}
    className="block bg-white p-6 rounded-xl shadow hover:shadow-2xl hover:-translate-y-2 transition"
  >
    <h3 className="font-semibold">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </Link>
);

const ModernCard = ({ icon, title, desc }) => (
  <div className="bg-white p-6 rounded-xl shadow hover:shadow-2xl hover:-translate-y-2 transition text-center">
    <div className="text-red-500 text-2xl mb-2">{icon}</div>
    <h3 className="font-bold">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);

const StepCard = ({ number, icon, title }) => (
  <div className="bg-white p-6 rounded-xl shadow flex items-center justify-center gap-4 hover:scale-105 transition">
    <div className="bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-full">
      {number}
    </div>
    <div className="text-red-500">{icon}</div>
    <h3>{title}</h3>
  </div>
);

const FaqItem = ({ q }) => (
  <div className="bg-white p-4 rounded shadow hover:shadow-md hover:scale-[1.02] transition cursor-pointer">
    {q}
  </div>
);
