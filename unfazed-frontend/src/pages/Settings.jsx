function Settings() {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      features: ["Up to 5 clients", "Basic scheduling", "Limited notes", "Analytics overview"],
      current: true,
    },
    {
      name: "Pro",
      price: "₹2,499",
      features: ["Unlimited clients", "Advanced scheduling", "AI-ready notes", "Full analytics", "Chat access"],
      current: false,
    },
    {
      name: "Premium",
      price: "₹4,999",
      features: ["Everything in Pro", "Priority support", "Custom workflows", "Advanced reporting", "Dedicated onboarding"],
      current: false,
    },
  ];

  return (
    <main className="min-h-screen bg-[#f5f4f1] p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="page-header">
          <div>
            <span className="page-kicker">Account</span>
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">Manage your Unfazed account and subscription plan.</p>
          </div>
        </div>

        <section className="panel p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Current plan</p>
              <h2 className="mt-1 text-3xl font-black tracking-[-0.06em] text-slate-900">Free</h2>
            </div>
            <button className="primary-btn">Upgrade plan</button>
          </div>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className={`panel p-6 ${plan.current ? "border-slate-900 bg-slate-900 text-white" : "bg-white text-slate-900"}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className={`text-sm ${plan.current ? "text-slate-300" : "text-slate-500"}`}>{plan.name}</p>
                  <p className="mt-3 text-3xl font-black tracking-[-0.06em]">{plan.price}</p>
                </div>
                {plan.current && <span className="badge badge--neutral">Current</span>}
              </div>

              <ul className={`mt-6 space-y-3 text-sm ${plan.current ? "text-slate-200" : "text-slate-600"}`}>
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className={`inline-block h-2 w-2 rounded-full ${plan.current ? "bg-white" : "bg-slate-900"}`} />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`mt-6 w-full ${plan.current ? "secondary-btn border-white/20 bg-white/10 text-white hover:bg-white/15" : "primary-btn"}`}>
                {plan.current ? "Current plan" : "Choose plan"}
              </button>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

export default Settings;