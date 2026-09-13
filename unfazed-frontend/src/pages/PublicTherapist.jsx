import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function PublicTherapist() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [therapist, setTherapist] = useState(null);
  const [packages, setPackages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTherapistData = async () => {
      try {
        setLoading(true);
        setError("");

        const therapistResponse = await api.get(`/therapist/public/${slug}`);
        setTherapist(therapistResponse.data.therapist);

        const packageResponse = await api.get(`/packages/public/${slug}`);
        setPackages(packageResponse.data.packages || []);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load therapist profile");
      } finally {
        setLoading(false);
      }
    };

    fetchTherapistData();
  }, [slug]);

  const handleBookSession = () => {
    navigate(`/intake?therapist=${therapist.slug}`);
  };

  const handleChoosePackage = () => {
    navigate(`/intake?therapist=${therapist.slug}`);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f4f1]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
          <p className="mt-4 text-slate-600">Loading therapist profile...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f4f1] px-6">
        <div className="w-full max-w-md rounded-[24px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black text-slate-900">Therapist not found</h1>
          <p className="mt-3 text-slate-600">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f4f1]">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">U</div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Unfazed</h1>
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Therapist profile</p>
            </div>
          </div>
        </div>
      </header>

      <section className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-5xl rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.04)] sm:p-8 lg:p-10">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-3xl font-black text-slate-700">
              {therapist?.name?.charAt(0)?.toUpperCase() || "T"}
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-[-0.05em] text-slate-900 sm:text-4xl">{therapist?.name}</h2>
              <p className="mt-2 text-slate-500">@{therapist?.slug}</p>
            </div>
          </div>

          <div className="my-8 border-t border-slate-200" />

          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">About</h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{therapist?.bio || "No bio available."}</p>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold text-slate-900">Areas of support</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {therapist?.specializations?.length > 0 ? (
                    therapist.specializations.map((specialization, index) => (
                      <span key={index} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                        {specialization}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-500">No specializations listed.</p>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold text-slate-900">Languages</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {therapist?.languages?.length > 0 ? (
                    therapist.languages.map((language, index) => (
                      <span key={index} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                        {language}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-500">No languages listed.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Session options</p>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                  <p className="font-semibold text-slate-900">Confidential care</p>
                  <p className="mt-1">Structured, respectful support in a private setting.</p>
                </div>
                <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                  <p className="font-semibold text-slate-900">Flexible sessions</p>
                  <p className="mt-1">Choose a plan that matches your pace and goals.</p>
                </div>
              </div>
              <button onClick={handleBookSession} className="primary-btn mt-6 w-full">Book a session</button>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-200 pt-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-2xl font-black tracking-[-0.05em] text-slate-900">Therapy packages</h3>
                <p className="mt-2 text-slate-500">Choose a package that works for you.</p>
              </div>
            </div>

            {packages.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-600">No packages are currently available.</div>
            ) : (
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {packages.map((pkg) => (
                  <div key={pkg._id} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                    <h4 className="text-xl font-bold text-slate-900">{pkg.name}</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{pkg.description || "Therapy package"}</p>

                    <div className="mt-5">
                      <span className="text-3xl font-black tracking-[-0.05em] text-slate-900">₹{pkg.price}</span>
                    </div>

                    <div className="mt-5 space-y-2 text-sm text-slate-600">
                      <p><span className="font-semibold text-slate-900">Sessions:</span> {pkg.sessionCount}</p>
                      <p><span className="font-semibold text-slate-900">Validity:</span> {pkg.validityDays} days</p>
                    </div>

                    <button onClick={handleChoosePackage} className="primary-btn mt-6 w-full">Choose package</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default PublicTherapist;