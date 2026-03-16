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
    <div className="bg-gray-50 text-gray-800">
      {/* ================= HERO ================= */}
      <section className="relative min-h-[75vh] bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
          <div>
            <span className="inline-block mb-5 text-sm font-semibold text-red-600 bg-red-100 px-5 py-1.5 rounded-full">
              Trusted Blood Donation Platform
            </span>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Save Lives <br />
              <span className="text-red-600">Donate Blood Easily</span>
            </h1>

            <p className="text-gray-600 mb-10 max-w-lg text-lg">
              BloodMatch connects donors and patients across Bangladesh during
              emergencies — fast, secure, and reliable.
            </p>

            <div className="flex flex-wrap gap-5">
              <Link
                to="/register"
                className="bg-red-600 text-white px-9 py-3.5 rounded-full font-semibold shadow-lg hover:bg-red-700 transition"
              >
                Become a Donor
              </Link>

              <Link
                to="/search"
                className="border-2 border-red-600 text-red-600 px-9 py-3.5 rounded-full font-semibold hover:bg-red-50 transition"
              >
                Find Donors
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center items-center">
            <div className="absolute w-80 h-80 rounded-full bg-red-400 blur-[120px] opacity-40"></div>

            <div className="relative bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl hover:scale-105 transition">
              <img
                src={donation}
                alt="Blood Donation"
                className="w-72 animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">Why Choose Us</h2>
            <div className="w-20 h-1 bg-red-600 mx-auto mt-3 rounded"></div>
            <p className="text-gray-500 mt-4">
              A reliable platform connecting donors and patients
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FaHeartbeat />}
              title="Emergency Support"
              desc="Instant blood donor matching for emergency cases."
            />

            <FeatureCard
              icon={<FaUserCheck />}
              title="Verified Donors"
              desc="All donors are verified for safety and trust."
            />

            <FeatureCard
              icon={<FaGlobeAsia />}
              title="Nationwide Service"
              desc="Available across cities and hospitals in Bangladesh."
            />
          </div>
        </div>
      </section>

      {/* ================= OUR IMPACT ================= */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">Our Impact</h2>
            <div className="w-20 h-1 bg-red-600 mx-auto mt-3 rounded"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Over the years, our platform has helped thousands of donors and
              patients. Here’s how we make a difference.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <ImpactCard number="10K+" label="Registered Donors" />
            <ImpactCard number="3K+" label="Blood Requests" />
            <ImpactCard number="2K+" label="Lives Saved" />
            <ImpactCard number="50+" label="Hospitals Connected" />
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12">How It Works</h2>
          <p className="text-gray-600 mb-16 max-w-3xl mx-auto">
            Donating blood is easy and impactful. Follow these simple steps to
            save a life.
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            <StepCard
              number={1}
              icon={<FaUserPlus />}
              title="Register"
              desc="Create your donor account quickly using your email and basic info."
            />

            <StepCard
              number={2}
              icon={<FaClipboardList />}
              title="Request Blood"
              desc="Patients or families can submit blood requests with details like blood group and hospital."
            />

            <StepCard
              number={3}
              icon={<FaHandsHelping />}
              title="Get Matched"
              desc="Our system matches donors nearby with the patient in need for immediate response."
            />

            <StepCard
              number={4}
              icon={<FaHeart />}
              title="Save Life"
              desc="Reach the hospital, donate blood, and make a real difference in someone's life."
            />
          </div>
        </div>
      </section>

      {/* ================= BLOOD GROUPS ================= */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12">Available Blood Groups</h2>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-5 max-w-3xl mx-auto">
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((b) => (
              <div
                key={b}
                className="bg-white shadow-md border border-red-100 rounded-xl py-5 font-bold text-red-600 hover:bg-red-600 hover:text-white hover:scale-105 transition"
              >
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div
            className="bg-white border border-black rounded-3xl shadow-lg p-12 text-center 
                    hover:shadow-2xl hover:scale-105 transition transform duration-300 ease-in-out"
          >
            <h2 className="text-4xl font-bold mb-6 text-red-600">
              Become a Lifesaver Today
            </h2>
            <p className="text-gray-600 mb-8">
              Join our community of blood donors and help save lives. Every
              donation counts!
            </p>

            <Link
              to="/register"
              className="bg-red-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition"
            >
              Register as Donor
            </Link>
          </div>
        </div>
      </section>
      {/* FLOAT ANIMATION */}
      <style>
        {`
        @keyframes float {
          0%,100% {transform: translateY(0);}
          50% {transform: translateY(-12px);}
        }
        .animate-float{
          animation: float 4s ease-in-out infinite;
        }
        `}
      </style>
    </div>
  );
}

/* ================= COMPONENTS ================= */
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white p-9 rounded-2xl shadow-md hover:shadow-2xl transition hover:-translate-y-2 text-center">
      <div className="text-red-600 text-3xl mb-4 flex justify-center">
        {icon}
      </div>
      <h3 className="font-bold text-xl mb-3">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}

function ImpactCard({ number, label }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition hover:-translate-y-2 text-center">
      <h3 className="text-4xl font-bold mb-3 text-red-600">{number}</h3>
      <p className="text-gray-600 font-medium">{label}</p>
    </div>
  );
}

function StepCard({ number, icon, title, desc }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition hover:-translate-y-2 text-center relative">
      <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center bg-red-100 text-red-600 rounded-full font-bold text-2xl">
        {icon}
      </div>
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
        {number}
      </div>
      <h3 className="font-semibold text-xl mt-6 mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}
