function Analytics() {
  const metrics = [
    { label: "Total Clients", value: "--", note: "Synced from client records" },
    { label: "Total Sessions", value: "--", note: "Across all bookings" },
    { label: "Revenue", value: "₹--", note: "Based on successful payments" },
    { label: "Completed Sessions", value: "--", note: "Finished appointments" },
    { label: "Cancelled Sessions", value: "--", note: "Rescheduled or refunded" },
    { label: "No-show Sessions", value: "--", note: "Needs follow-up" },
    { label: "Upcoming Sessions", value: "--", note: "Scheduled next" },
    { label: "Paid Payments", value: "--", note: "Verified transactions" },
    { label: "Failed Payments", value: "--", note: "Requires review" },
  ];

  return (
    <main className="min-h-screen bg-[#f5f4f1] p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="page-header">
          <div>
            <span className="page-kicker">Practice overview</span>
            <h1 className="page-title">Analytics</h1>
            <p className="page-subtitle">Track your therapy practice performance and care delivery.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric) => (
            <div key={metric.label} className="kpi-card">
              <p className="kpi-label">{metric.label}</p>
              <p className="kpi-value">{metric.value}</p>
              <p className="kpi-note">{metric.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="panel p-6">
            <h2 className="text-xl font-bold text-slate-900">Session overview</h2>
            <div className="mt-6 h-64 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex h-full items-end gap-3">
                {[30, 52, 48, 66, 58, 72, 80].map((height, index) => (
                  <div key={index} className="flex-1 rounded-t-2xl bg-slate-900/80" style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>
          </div>

          <div className="panel p-6">
            <h2 className="text-xl font-bold text-slate-900">Insights</h2>
            <div className="mt-6 space-y-4 text-sm text-slate-600">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Retention</p>
                <p className="mt-1">Client activity is trending in a healthy range across recent sessions.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Booking flow</p>
                <p className="mt-1">Appointment conversion remains steady and supported by existing follow-up processes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Analytics;