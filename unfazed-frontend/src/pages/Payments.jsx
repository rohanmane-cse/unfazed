import { useEffect, useState } from "react";
import api from "../services/api";

function Payments() {
  const [packages, setPackages] = useState([]);
  const [clients, setClients] = useState([]);

  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedClient, setSelectedClient] = useState("");

  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const selectedPackageDetails = packages.find(
    (item) => item._id === selectedPackage
  );

  // ========================================
  // LOAD PACKAGES + CLIENTS
  // ========================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [packageResponse, clientResponse] =
          await Promise.all([
            api.get("/packages", { headers }),
            api.get("/clients", { headers }),
          ]);

        setPackages(
          packageResponse.data.packages || []
        );

        setClients(
          clientResponse.data.clients || []
        );
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to load payment data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ========================================
  // LOAD RAZORPAY SCRIPT
  // ========================================

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  // ========================================
  // START PAYMENT
  // ========================================

  const handlePayment = async () => {
    setMessage("");
    setError("");

    if (!selectedClient) {
      setError("Please select a client.");
      return;
    }

    if (!selectedPackage) {
      setError("Please select a package.");
      return;
    }

    try {
      setPaying(true);

      // Load Razorpay Checkout
      const razorpayLoaded = await loadRazorpay();

      if (!razorpayLoaded) {
        setError(
          "Razorpay Checkout could not be loaded."
        );
        return;
      }

      // Create order on backend
      const orderResponse = await api.post(
        "/payments/create-order",
        {
          client: selectedClient,
          packageId: selectedPackage,
        },
        {
          headers,
        }
      );

      const order = orderResponse.data.order;

      const razorpayKey =
        import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        setError(
          "Razorpay Key ID is missing from frontend .env"
        );
        return;
      }

      // ========================================
      // RAZORPAY OPTIONS
      // ========================================

      const options = {
        key: razorpayKey,

        amount: order.amount,

        currency: order.currency,

        name: "Unfazed",

        description:
          orderResponse.data.package?.name ||
          "Therapy Package",

        order_id: order.id,

        handler: async function (response) {
          try {
            setMessage(
              "Payment completed. Verifying payment..."
            );

            const verifyResponse =
              await api.post(
                "/payments/verify",
                {
                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,
                },
                {
                  headers,
                }
              );

            setMessage(
              verifyResponse.data.message ||
                "Payment verified successfully."
            );

            setSelectedClient("");
            setSelectedPackage("");
          } catch (error) {
            console.error(error);

            setError(
              error.response?.data?.message ||
                "Payment verification failed."
            );
          }
        },

        prefill: {
          name:
            clients.find(
              (client) =>
                client._id === selectedClient
            )?.name || "",

          email:
            clients.find(
              (client) =>
                client._id === selectedClient
            )?.email || "",
        },

        theme: {
          color: "#000000",
        },

        modal: {
          ondismiss: function () {
            setMessage("");
            setError("Payment was cancelled.");
          },
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Payment failed:",
            response.error
          );

          setError(
            response.error?.description ||
              "Payment failed."
          );
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to start payment."
      );
    } finally {
      setPaying(false);
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f4f1] p-6">
        <div className="mx-auto max-w-6xl">
          <div className="panel p-10 text-center text-slate-600">Loading payment data...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f4f1] p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="page-header">
          <div>
            <span className="page-kicker">Billing</span>
            <h1 className="page-title">Payments</h1>
            <p className="page-subtitle">Manage therapy packages and client payments.</p>
          </div>
        </div>

        {message && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="panel p-6">
            <h2 className="text-xl font-black tracking-[-0.04em] text-slate-900">Create payment</h2>
            <p className="mt-2 text-sm text-slate-500">Select a client and therapy package.</p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="label">Client</label>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select client</option>
                  {clients.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.name} {client.email ? `(${client.email})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Therapy package</label>
                <select
                  value={selectedPackage}
                  onChange={(e) => setSelectedPackage(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select package</option>
                  {packages.map((pkg) => (
                    <option key={pkg._id} value={pkg._id}>
                      {pkg.name} - ₹{pkg.price}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedPackageDetails && (
              <div className="mt-6 rounded-[22px] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-bold text-slate-900">{selectedPackageDetails.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {selectedPackageDetails.description || "Therapy package"}
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-sm text-slate-500">Sessions</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">{selectedPackageDetails.sessionCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Validity</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">{selectedPackageDetails.validityDays} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Price</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">₹{selectedPackageDetails.price}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={paying}
              className="primary-btn mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {paying ? "Starting payment..." : "Pay with Razorpay"}
            </button>
          </div>

          <div className="panel p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Selected plan</p>
            {selectedPackageDetails ? (
              <>
                <h3 className="mt-4 text-2xl font-black tracking-[-0.05em] text-slate-900">₹{selectedPackageDetails.price}</h3>
                <p className="mt-3 text-sm text-slate-600">{selectedPackageDetails.name}</p>
                <div className="mt-6 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
                    <span>Sessions</span>
                    <strong className="text-slate-900">{selectedPackageDetails.sessionCount}</strong>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
                    <span>Validity</span>
                    <strong className="text-slate-900">{selectedPackageDetails.validityDays} days</strong>
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-6 rounded-[22px] border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                No package selected yet.
              </div>
            )}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-black tracking-[-0.04em] text-slate-900">Available packages</h2>

          {packages.length === 0 ? (
            <div className="mt-4 panel p-6 text-slate-500">No packages available.</div>
          ) : (
            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {packages.map((pkg) => (
                <div
                  key={pkg._id}
                  className={`rounded-[24px] border p-6 shadow-sm transition ${
                    selectedPackage === pkg._id
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-900"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className={`text-xl font-bold ${selectedPackage === pkg._id ? "text-white" : "text-slate-900"}`}>
                      {pkg.name}
                    </h3>
                    {selectedPackage === pkg._id && <span className="badge badge--neutral">Selected</span>}
                  </div>

                  <p className={`mt-2 text-sm leading-6 ${selectedPackage === pkg._id ? "text-slate-200" : "text-slate-600"}`}>
                    {pkg.description || "Therapy package"}
                  </p>

                  <p className={`mt-5 text-3xl font-black tracking-[-0.06em] ${selectedPackage === pkg._id ? "text-white" : "text-slate-900"}`}>
                    ₹{pkg.price}
                  </p>

                  <div className={`mt-5 space-y-2 text-sm ${selectedPackage === pkg._id ? "text-slate-200" : "text-slate-600"}`}>
                    <p>Sessions: <span className={selectedPackage === pkg._id ? "text-white" : "text-slate-900"}>{pkg.sessionCount}</span></p>
                    <p>Validity: <span className={selectedPackage === pkg._id ? "text-white" : "text-slate-900"}>{pkg.validityDays} days</span></p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedPackage(pkg._id)}
                    className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-semibold ${
                      selectedPackage === pkg._id
                        ? "bg-white text-slate-900"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    {selectedPackage === pkg._id ? "Selected" : "Choose package"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Payments;