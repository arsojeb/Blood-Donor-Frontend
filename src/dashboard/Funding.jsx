import { useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Funding() {
  const { user } = useAuth();
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(null);

  // Fetch funds
  useEffect(() => {
    const fetchFunds = async () => {
      try {
        if (user.role === "admin") {
          const res = await API.get("/fundings");
          setFunds(res.data);
        } else {
          const res = await API.get("/fundings/my");
          setFunds(res.data);
        }
      } catch (err) {
        setError("Failed to fetch funds.");
      } finally {
        setLoading(false);
      }
    };
    fetchFunds();
  }, [user.role]);

  // Give fund
  const handleGiveFund = async () => {
    if (!amount) return;
    try {
      await API.post("/fundings", { amount: parseFloat(amount) });
      setAmount("");
      alert("Fund successfully given!");
      // Update local state
      if (user.role === "admin") {
        const res = await API.get("/fundings");
        setFunds(res.data);
      } else {
        const res = await API.get("/fundings/my");
        setFunds(res.data);
      }
    } catch (err) {
      setError("Failed to give fund.");
    }
  };

  const totalFunds = funds.reduce((acc, f) => acc + parseFloat(f.amount), 0);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-red-600">💰 Funding</h2>

      {/* Give fund section - everyone can use */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          onClick={handleGiveFund}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Give Fund
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Admin: show all donations in table */}
      {user.role === "admin" && (
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
                  {funds.map((f, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{f.email}</td>
                      <td className="border px-4 py-2">৳{f.amount}</td>
                      <td className="border px-4 py-2">{new Date(f.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Regular user: show own total donation */}
      {user.role !== "admin" && !loading && (
        <div className="bg-white shadow p-4 rounded mb-4">
          <h3 className="text-xl font-semibold mb-2">Your Contribution</h3>
          <p className="text-lg font-bold text-green-600">৳{totalFunds}</p>
        </div>
      )}
    </div>
  );
}
