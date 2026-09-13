import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  CalendarDays,
  IndianRupee,
  Package,
  FileText,
} from "lucide-react";
import api from "../services/api";

function ClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [packages, setPackages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const loadClient = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          clientResponse,
          sessionsResponse,
          paymentsResponse,
        ] = await Promise.all([
          api.get(`/clients/${id}`, authConfig),
          api.get("/sessions", authConfig),
          api.get("/payments", authConfig).catch(() => ({
            data: { payments: [] },
          })),
        ]);

        setClient(clientResponse.data.client);

        const allSessions =
          sessionsResponse.data.sessions || [];

        const clientSessions = allSessions.filter(
          (session) =>
            session.client?._id === id ||
            session.client === id
        );

        setSessions(clientSessions);

        const allPayments =
          paymentsResponse.data.payments || [];

        const clientPayments = allPayments.filter(
          (payment) =>
            payment.client?._id === id ||
            payment.client === id
        );

        setPayments(clientPayments);

        setPackages(
          clientResponse.data.clientPackages || []
        );
      } catch (err) {
        console.error("Client details error:", err);

        setError(
          err.response?.data?.message ||
          "Failed to load client details"
        );
      } finally {
        setLoading(false);
      }
    };

    loadClient();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">
              Loading client details...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !client) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-6xl">

          <button
            onClick={() => navigate("/clients")}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <ArrowLeft size={18} />
            Back to Clients
          </button>

          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-red-600">
              {error || "Client not found"}
            </p>
          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">

        {/* Back */}
        <button
          onClick={() => navigate("/clients")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black"
        >
          <ArrowLeft size={18} />
          Back to Clients
        </button>

        {/* Profile Header */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-3xl font-bold text-gray-700">
              {client.name
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {client.name}
              </h1>

              <p className="mt-1 text-gray-500">
                Client Profile
              </p>
            </div>

          </div>

        </section>

        {/* Information */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* Personal Information */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">
              <User size={21} />
              <h2 className="text-xl font-semibold">
                Personal Information
              </h2>
            </div>

            <div className="mt-6 space-y-5">

              <InfoRow
                icon={<Mail size={18} />}
                label="Email"
                value={client.email}
              />

              <InfoRow
                icon={<Phone size={18} />}
                label="Phone"
                value={client.phone || "Not provided"}
              />

              <InfoRow
                icon={<CalendarDays size={18} />}
                label="Client Since"
                value={formatDate(client.createdAt)}
              />

              <InfoRow
                icon={<FileText size={18} />}
                label="Consent"
                value={
                  client.consentGiven
                    ? `Given on ${formatDate(
                        client.consentDate
                      )}`
                    : "Not given"
                }
              />

            </div>

          </section>

          {/* Clinical Information */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">
              <FileText size={21} />
              <h2 className="text-xl font-semibold">
                Clinical Information
              </h2>
            </div>

            <div className="mt-6">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Presenting Concern
                </p>

                <p className="mt-2 text-gray-800">
                  {client.presentingConcern ||
                    "Not provided"}
                </p>
              </div>

              <div className="mt-6 border-t pt-5">
                <p className="text-sm font-medium text-gray-500">
                  History
                </p>

                <p className="mt-2 whitespace-pre-wrap text-gray-800">
                  {client.history ||
                    "No history provided"}
                </p>
              </div>

            </div>

          </section>

        </div>

        {/* Sessions */}
        <section className="mt-6 rounded-2xl bg-white shadow-sm">

          <div className="border-b p-6">
            <div className="flex items-center gap-3">
              <CalendarDays size={21} />

              <div>
                <h2 className="text-xl font-semibold">
                  Sessions
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {sessions.length} session
                  {sessions.length !== 1
                    ? "s"
                    : ""}
                </p>
              </div>
            </div>
          </div>

          {sessions.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              No sessions found.
            </div>
          ) : (
            <div className="divide-y">

              {sessions.map((session) => (
                <div
                  key={session._id}
                  className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div>
                    <p className="font-medium text-gray-900">
                      {formatDate(session.date)}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {session.startTime} -{" "}
                      {session.endTime}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700">
                    {session.status}
                  </span>

                </div>
              ))}

            </div>
          )}

        </section>

        {/* Payments */}
        <section className="mt-6 rounded-2xl bg-white shadow-sm">

          <div className="border-b p-6">
            <div className="flex items-center gap-3">
              <IndianRupee size={21} />

              <div>
                <h2 className="text-xl font-semibold">
                  Payments
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Payment history for this client.
                </p>
              </div>
            </div>
          </div>

          {payments.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              No payments found.
            </div>
          ) : (
            <div className="divide-y">

              {payments.map((payment) => (
                <div
                  key={payment._id}
                  className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div>
                    <p className="font-medium text-gray-900">
                      {formatCurrency(payment.amount)}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {formatDate(payment.createdAt)}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700">
                    {payment.status}
                  </span>

                </div>
              ))}

            </div>
          )}

        </section>

        {/* Packages */}
        <section className="mt-6 rounded-2xl bg-white shadow-sm">

          <div className="border-b p-6">
            <div className="flex items-center gap-3">
              <Package size={21} />

              <div>
                <h2 className="text-xl font-semibold">
                  Packages
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Client package information.
                </p>
              </div>
            </div>
          </div>

          {packages.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              No packages found.
            </div>
          ) : (
            <div className="grid gap-4 p-6 md:grid-cols-2">

              {packages.map((item) => (
                <div
                  key={item._id}
                  className="rounded-xl border border-gray-200 p-5"
                >

                  <h3 className="font-semibold text-gray-900">
                    {item.package?.name ||
                      "Package"}
                  </h3>

                  <div className="mt-4 grid grid-cols-2 gap-4">

                    <div>
                      <p className="text-xs text-gray-500">
                        Total Sessions
                      </p>

                      <p className="mt-1 font-semibold">
                        {item.totalSessions}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Remaining
                      </p>

                      <p className="mt-1 font-semibold">
                        {item.remainingSessions}
                      </p>
                    </div>

                  </div>

                  <div className="mt-4">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize">
                      {item.status}
                    </span>
                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">

      <div className="mt-0.5 text-gray-500">
        {icon}
      </div>

      <div>
        <p className="text-sm text-gray-500">
          {label}
        </p>

        <p className="mt-1 text-sm font-medium text-gray-900">
          {value}
        </p>
      </div>

    </div>
  );
}

export default ClientDetails;