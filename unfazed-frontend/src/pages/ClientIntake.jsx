import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";

function ClientIntake() {
  const [searchParams] = useSearchParams();
  const therapistSlug = searchParams.get("therapist");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    presentingConcern: "",
    history: "",
    consentGiven: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!formData.consentGiven) {
      setError("Please provide consent before continuing.");
      return;
    }

    if (!therapistSlug) {
      setError("Therapist information is missing.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/clients/public", {
        therapistSlug,
        ...formData,
      });

      setMessage(response.data.message || "Your information was submitted successfully.");

      setFormData({
        name: "",
        email: "",
        phone: "",
        presentingConcern: "",
        history: "",
        consentGiven: false,
      });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit your information.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f4f1] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">Confidential intake</span>
          <h1 className="mt-5 text-3xl font-black tracking-[-0.05em] text-slate-900 sm:text-4xl">Client intake form</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
            Please provide some basic information before booking your therapy session.
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_22px_50px_rgba(15,23,42,0.04)] sm:p-8">
          {message && (
            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label" htmlFor="name">Full Name</label>
              <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" className="input-field" required />
            </div>

            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className="input-field" required />
            </div>

            <div>
              <label className="label" htmlFor="phone">Phone Number</label>
              <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" className="input-field" />
            </div>

            <div>
              <label className="label" htmlFor="presentingConcern">Presenting Concern</label>
              <textarea id="presentingConcern" name="presentingConcern" value={formData.presentingConcern} onChange={handleChange} placeholder="Briefly describe what you would like support with..." rows="4" className="input-field" required />
            </div>

            <div>
              <label className="label" htmlFor="history">Relevant History</label>
              <textarea id="history" name="history" value={formData.history} onChange={handleChange} placeholder="Share any relevant previous therapy or personal history..." rows="4" className="input-field" />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input type="checkbox" name="consentGiven" checked={formData.consentGiven} onChange={handleChange} className="mt-1 h-4 w-4 rounded border-slate-300" />
                <span className="text-sm leading-6 text-slate-700">I give consent to receive therapy services and understand that the information I provide will be used for my therapy-related care.</span>
              </label>
            </div>

            <button type="submit" disabled={loading} className="primary-btn w-full">
              {loading ? "Submitting..." : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default ClientIntake;