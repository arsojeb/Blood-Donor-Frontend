import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* BANNER */}
      <section className="bg-red-50 flex-grow flex items-center">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-4">
            Donate Blood, Save Lives
          </h1>
          <p className="text-gray-600 mb-8">
            One donation can save up to three lives. Be a hero today.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/register"
              className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700"
            >
              Join as a Donor
            </Link>
            <Link
              to="/search"
              className="border border-red-600 text-red-600 px-6 py-3 rounded hover:bg-red-100"
            >
              Search Donors
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-red-600 mb-10">
            Why Blood Donation Matters
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-6 text-center shadow">
              <h3 className="font-semibold text-lg mb-2">Save Lives</h3>
              <p className="text-gray-600">
                Blood donation helps accident victims and critical patients.
              </p>
            </div>

            <div className="border rounded-lg p-6 text-center shadow">
              <h3 className="font-semibold text-lg mb-2">Emergency Ready</h3>
              <p className="text-gray-600">
                Hospitals need blood every day for emergencies.
              </p>
            </div>

            <div className="border rounded-lg p-6 text-center shadow">
              <h3 className="font-semibold text-lg mb-2">Community Support</h3>
              <p className="text-gray-600">
                Donating blood strengthens community care and unity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-red-600 mb-8">
            Contact Us
          </h2>

          <form className="grid gap-4">
            <input
              type="text"
              placeholder="Your Name"
              className="border px-4 py-2 rounded"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="border px-4 py-2 rounded"
            />
            <textarea
              placeholder="Your Message"
              rows="4"
              className="border px-4 py-2 rounded"
            />
            <button className="bg-red-600 text-white py-2 rounded hover:bg-red-700">
              Send Message
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            📞 Emergency Contact: +880 1234-567890
          </p>
        </div>
      </section>
    </div>
  );
}
