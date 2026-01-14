import { Link } from "react-router-dom";
import donation from "../assets/donation.png";

export default function Home() {
  return (
    <div className="bg-white text-gray-800">

      {/* ================= HERO ================= */}
      <section className="relative min-h-[75vh] bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">

          {/* LEFT CONTENT */}
          <div>
            <span className="inline-block mb-5 text-sm font-semibold text-red-600 bg-red-100 px-5 py-1.5 rounded-full shadow-sm">
              Trusted Blood Donation Platform
            </span>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
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
                className="bg-red-600 text-white px-9 py-3.5 rounded-full font-semibold shadow-lg hover:bg-red-700 hover:shadow-red-300/50 transition-all duration-300"
              >
                Become a Donor
              </Link>

              <Link
                to="/search"
                className="border-2 border-red-600 text-red-600 px-9 py-3.5 rounded-full font-semibold hover:bg-red-50 transition-all duration-300"
              >
                Find Donors
              </Link>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative flex justify-center items-center">

            {/* Glow */}
            <div className="absolute w-80 h-80 md:w-[26rem] md:h-[26rem] rounded-full bg-red-400 blur-[120px] opacity-40"></div>

            {/* Glass Card */}
            <div className="relative bg-white/70 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl transition-all duration-500 hover:scale-105 hover:rotate-1">
              <img
                src={donation}
                alt="Blood Donation"
                className="w-64 md:w-80 animate-float drop-shadow-xl"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-24 border-t">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          {[
            { title: "Fast Emergency Support", desc: "Instant donor matching" },
            { title: "Verified Blood Donors", desc: "Safe & trusted donors" },
            { title: "Nationwide Coverage", desc: "Available across Bangladesh" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-9 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 text-center hover:-translate-y-1"
            >
              <h3 className="font-bold text-xl mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-14">How It Works</h2>

          <div className="grid md:grid-cols-4 gap-8">
            {["Register", "Request Blood", "Get Matched", "Save Life"].map(
              (step, i) => (
                <div
                  key={i}
                  className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center bg-red-100 text-red-600 rounded-full font-bold text-lg">
                    {i + 1}
                  </div>
                  <h3 className="font-semibold text-lg">{step}</h3>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ================= BLOOD GROUPS ================= */}
      <section className="py-24 border-t">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12">Available Blood Groups</h2>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 max-w-3xl mx-auto">
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((b) => (
              <div
                key={b}
                className="border border-red-200 rounded-xl py-4 font-bold text-red-600 hover:bg-red-50 hover:scale-105 transition-all duration-300"
              >
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FLOAT ANIMATION ================= */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-12px); }
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}
