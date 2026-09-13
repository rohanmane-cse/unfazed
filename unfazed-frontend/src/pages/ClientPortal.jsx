import { useEffect, useState } from "react";
import { CalendarDays, FileText, CreditCard, MessageCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";

function ClientPortal() {
  const [searchParams] = useSearchParams();
  const therapistSlug = searchParams.get("therapist") || "test-therapist";

  const [therapist, setTherapist] = useState(null);
  const [packages, setPackages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPortal = async () => {
      try {
        setLoading(true);

        const [therapistResponse, packageResponse] = await Promise.all([
          api.get(`/therapist/public/${therapistSlug}`),
          api.get(`/packages/public/${therapistSlug}`),
        ]);

        setTherapist(therapistResponse.data.therapist);
        setPackages(packageResponse.data.packages || []);
      } catch (err) {
        console.error("Portal error:", err);
        setError(err.response?.data?.message || "Failed to load therapist portal");
      } finally {
        setLoading(false);
      }
    };

    loadPortal();
  }, [therapistSlug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f4f1] p-6">
        <div className="mx-auto max-w-5xl rounded-[28px] border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">
          Loading therapist portal...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#f5f4f1] p-6">
        <div className="mx-auto max-w-5xl rounded-[28px] border border-slate-200 bg-white p-10 text-center text-red-600 shadow-sm">
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f4f1]">
      <section className="bg-slate-950 px-4 py-16 text-white sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl font-black text-slate-900">
            {therapist?.name?.charAt(0)?.toUpperCase()}
          </div>
          <h1 className="mt-6 text-4xl font-black tracking-[-0.06em] sm:text-5xl">{therapist?.name}</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">{therapist?.bio || "Professional therapy and mental wellness support."}</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <section className="panel p-6">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-900">About</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">{therapist?.bio || "Get professional support in a safe and confidential environment."}</p>

          {therapist?.specializations?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-slate-900">Specializations</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {therapist.specializations.map((item) => (
                  <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">{item}</span>
                ))}
              </div>
            </div>
          )}

          {therapist?.languages?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-slate-900">Languages</h3>
              <p className="mt-2 text-slate-600">{therapist.languages.join(", ")}</p>
            </div>
          )}
        </section>

        <section className="mt-8">
          <div>
            <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-900">Therapy packages</h2>
            <p className="mt-2 text-slate-500">Choose a package that works for you.</p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {packages.length === 0 ? (
              <div className="rounded-[24px] border border-slate-200 bg-white p-8 text-slate-500 md:col-span-3">No packages available.</div>
            ) : (
              packages.map((item) => (
                <div key={item._id} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900">{item.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  <p className="mt-5 text-3xl font-black tracking-[-0.06em] text-slate-900">₹{item.price}</p>
                  <p className="mt-2 text-sm text-slate-500">{item.sessionCount} sessions</p>
                  <p className="mt-1 text-sm text-slate-500">Valid for {item.validityDays} days</p>
                  <Link to={`/intake?therapist=${therapistSlug}&package=${item._id}`} className="primary-btn mt-6 block w-full">Choose package</Link>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <PortalAction icon={<CalendarDays size={21} />} title="Book Session" description="Schedule an appointment" to={`/intake?therapist=${therapistSlug}`} />
          <PortalAction icon={<FileText size={21} />} title="Intake Form" description="Share your information" to={`/intake?therapist=${therapistSlug}`} />
          <PortalAction icon={<CreditCard size={21} />} title="Payments" description="Manage your payments" to="/portal" />
          <PortalAction icon={<MessageCircle size={21} />} title="Messages" description="Contact your therapist" to="/portal" />
        </section>
      </div>
    </main>
  );
}

function PortalAction({ icon, title, description, to }) {
  return (
    <Link to={to} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">{icon}</div>
      <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </Link>
  );
}

export default ClientPortal;