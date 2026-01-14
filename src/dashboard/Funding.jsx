import { useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Funding() {
  const { user } = useAuth();
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  // ================== FETCH FUNDS ==================
  const fetchFunds = async () => {
    if (!user || !user.role) return; // safeguard

    setLoading(true);
    setError("");

    try {
      const url = user.role === "admin" ? "/fundings" : "/fundings/my";
      const res = await API.get(url);
      setFunds(res.data || []); // default to empty array
    } catch (err) {
      console.error(err.response || err.message);
      setError(
        err.response?.data?.message || "Failed to fetch funds. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================== RUN FETCH ON USER ROLE ==================
  useEffect(() => {
    fetchFunds();
  }, [user?.role]); // optional chaining ensures no crash if user undefined

  // ================== GIVE FUND ==================
  const handleGiveFund = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    setError("");
    try {
      await API.post("/fundings", { amount: parseFloat(amount) });
      setAmount("");
      alert("Fund successfully given!");
      fetchFunds(); // refresh funds
    } catch (err) {
      console.error(err.response || err.message);
      setError(
        err.response?.data?.message || "Failed to give fund. Please try again."
      );
    }
  };

  // ================== TOTAL FUNDS ==================
  const totalFunds = funds.reduce((acc, f) => acc + parseFloat(f.amount || 0), 0);

  // ================== RENDER ==================
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-red-600">💰 Funding</h2>

      {/* Give Fund Section */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border rounded px-3 py-2 flex-1 focus:border-red-600 focus:ring-1 focus:ring-red-600"
        />
        <button
          onClick={handleGiveFund}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Give Fund
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* ADMIN VIEW */}
      {user?.role === "admin" && (
        <>
          <div className="mb-4 font-semibold text-lg">
            Total Funds: ৳{totalFunds}
          </div>

          {loading ? (
            <p>Loading donations...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2 text-left">Donor</th>
                    <th className="border px-4 py-2 text-left">Amount</th>
                    <th className="border px-4 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {funds.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-gray-500">
                        No donations found.
                      </td>
                    </tr>
                  ) : (
                    funds.map((f, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border px-4 py-2">{f.email}</td>
                        <td className="border px-4 py-2">৳{f.amount}</td>
                        <td className="border px-4 py-2">
                          {new Date(f.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* USER VIEW */}
      {user?.role !== "admin" && (
        <div className="bg-white shadow p-4 rounded mb-4">
          <h3 className="text-xl font-semibold mb-2">Your Contribution</h3>
          {loading ? (
            <p>Loading your donations...</p>
          ) : (
            <p className="text-lg font-bold text-green-600">৳{totalFunds}</p>
          )}
        </div>
      )}
    </div>
  );
}
