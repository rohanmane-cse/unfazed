function Home() {
  const features = [
    "Client management",
    "Session scheduling",
    "Secure notes",
    "Payments & packages",
  ];

  return (
    <main className="min-h-screen bg-[#f5f4f1]">
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.04)]">
          <div className="grid items-center gap-10 px-6 py-10 sm:px-8 lg:grid-cols-[1.3fr_0.9fr] lg:px-10 lg:py-14">
            <div>
              <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                Professional therapy workflows
              </span>

              <h1 className="mt-6 text-4xl font-black tracking-[-0.06em] text-slate-900 sm:text-5xl lg:text-6xl">
                Better care,
                <span className="block text-slate-500">with less admin.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                Unfazed helps therapists manage client care, clinical notes, sessions, and payments from one calm, secure platform built for modern mental health practice.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/register"
                  className="primary-btn"
                >
                  Get Started
                </a>

                <a
                  href="/login"
                  className="secondary-btn"
                >
                  Therapist Login
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {features.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 shadow-sm sm:p-7">
              <div className="rounded-[20px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Overview</p>
                    <h2 className="mt-1 text-xl font-bold text-slate-900">Practice health</h2>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    +18.4%
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.1em] text-slate-500">Active clients</p>
                    <div className="mt-2 flex items-end justify-between">
                      <span className="text-3xl font-black tracking-[-0.06em] text-slate-900">148</span>
                      <span className="text-sm font-medium text-emerald-700">+12 this month</span>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.1em] text-slate-500">Sessions</p>
                      <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-slate-900">64</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.1em] text-slate-500">Revenue</p>
                      <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-slate-900">₹1.8L</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-900 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Upcoming</span>
                      <span className="rounded-full bg-white/10 px-2 py-1 text-xs font-medium">Today</span>
                    </div>
                    <p className="mt-3 text-xl font-bold">5 scheduled sessions</p>
                    <p className="mt-1 text-sm text-slate-300">Average wait time: 2 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;