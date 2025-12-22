import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-red-600 text-white py-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Logo / Brand */}
        <div className="text-xl font-bold">BloodDonor</div>
        
        {/* Useful Links */}
        <div className="flex flex-col sm:flex-row gap-4 text-center md:text-left">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/search" className="hover:underline">Search Donors</Link>
          <Link to="/donation-requests" className="hover:underline">Donation Requests</Link>
          <Link to="/fundings" className="hover:underline">Funding</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
        </div>

        {/* Contact Info */}
        <div className="text-center md:text-right">
          <p>📞 +880123456789</p>
          <p>✉️ support@blooddonor.com</p>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="mt-6 text-center text-sm text-red-200">
        &copy; 2025 BloodDonor. All rights reserved.
      </div>
    </footer>
  );
}
