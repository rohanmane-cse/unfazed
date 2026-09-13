import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await api.post("/auth/register", formData);
      setMessage(response.data.message || "Registration successful");
      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f4f1] px-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">U</div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Unfazed</p>
              <h1 className="text-xl font-bold text-slate-900">Create account</h1>
            </div>
          </div>
        </div>

        <div className="px-6 py-7 sm:px-8">
          <h2 className="text-3xl font-black tracking-[-0.05em] text-slate-900">Get started</h2>
          <p className="mt-2 text-sm text-slate-600">Create your therapist profile and begin practicing with clarity.</p>

          {message && (
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label className="label" htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="input-field"
                required
              />
            </div>

            <button type="submit" className="primary-btn w-full">
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account? {" "}
            <Link to="/login" className="font-semibold text-slate-900 underline-offset-4 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Register;