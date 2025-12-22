import { useAuth } from "../context/AuthContext";
import { createDonationRequest } from "../api/donation.api";

export default function CreateDonationRequest() {
  const { user } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    if (user.status === "blocked") {
      return alert("You are blocked by admin");
    }

    const form = Object.fromEntries(new FormData(e.target));
    await createDonationRequest({
      ...form,
      requesterEmail: user.email,
      requesterName: user.name,
    });

    alert("Donation request created");
  };

  return (
    <form onSubmit={submit} className="bg-white p-6 rounded">
      <input name="recipientName" placeholder="Recipient Name" required />
      <input name="hospital" placeholder="Hospital Name" required />
      <button className="btn-primary">Request</button>
    </form>
  );
}
