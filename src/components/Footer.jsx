import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-linear-to-r from-red-600 to-red-700 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* TOP */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* BRAND */}
          <div>
            <h2 className="text-2xl font-extrabold mb-3">
              🩸 BloodDonor
            </h2>
            <p className="text-red-100 text-sm leading-relaxed">
              Connecting blood donors and patients across Bangladesh.
              Fast, safe, and reliable emergency support.
            </p>
          </div>

          {/* LINKS */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-red-100">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/search" className="hover:text-white">Search Donors</Link></li>
              <li><Link to="/dashboard/donate" className="hover:text-white">Donation Requests</Link></li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-red-100">
              <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <p className="text-red-100 text-sm mb-2">
              📞 +880 1234 567 890
            </p>
            <p className="text-red-100 text-sm mb-4">
              ✉️ support@blooddonor.com
            </p>

            {/* SOCIAL */}
            <div className="flex gap-3">
              {["Facebook", "Twitter", "Instagram"].map((s) => (
                <span
                  key={s}
                  className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm hover:bg-white hover:text-red-600 cursor-pointer transition"
                >
                  {s[0]}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-red-500 my-8"></div>

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-red-200 gap-4">
          <p>
            © {new Date().getFullYear()} BloodDonor. All rights reserved.
          </p>
          <p>
            Made with ❤️ for saving lives
          </p>
        </div>
      </div>
    </footer>
  );
}
