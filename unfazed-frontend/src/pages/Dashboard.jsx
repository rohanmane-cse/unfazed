import { useEffect, useState } from "react";
import { CalendarDays, Clock, Plus, X } from "lucide-react";
import api from "../services/api";

function Schedule() {
  const [sessions, setSessions] = useState([]);
  const [clients, setClients] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    client: "",
    date: "",
    startTime: "",
    endTime: "",
    duration: 60,
  });

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [sessionResponse, clientResponse] =
        await Promise.all([
          api.get("/sessions", authConfig),
          api.get("/clients", authConfig),
        ]);

      setSessions(sessionResponse.data.sessions || []);
      setClients(clientResponse.data.clients || []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to load schedule"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "duration"
          ? Number(value)
          : value,
    }));
  };

  const createSession = async (e) => {
    e.preventDefault();

    if (
      !form.client ||
      !form.date ||
      !form.startTime ||
      !form.endTime
    ) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await api.post(
        "/sessions",
        form,
        authConfig
      );

      setForm({
        client: "",
        date: "",
        startTime: "",
        endTime: "",
        duration: 60,
      });

      setShowForm(false);

      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to create session"
      );
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-6xl rounded-2xl bg-white p-10 text-center shadow-sm">
          Loading schedule...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6">

      <div className="mx-auto max-w-6xl">

        {/* Header */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm text-gray-500">
              Therapist Dashboard
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Schedule
            </h1>

            <p className="mt-2 text-gray-500">
              Manage your therapy sessions.
            </p>
          </div>

          <button
            onClick={() => {
              setError("");
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 font-medium text-white hover:bg-gray-800"
          >
            <Plus size={18} />
            Book Session
          </button>

        </div>

        {/* Error */}

        {error && (
          <div className="mt-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            <span>{error}</span>

            <button
              onClick={() => setError("")}
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Booking Form */}

        {showForm && (
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-semibold">
                  Book Session
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Create a new therapy appointment.
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={createSession}
              className="mt-6 space-y-5"
            >

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Client *
                  </label>

                  <select
                    name="client"
                    value={form.client}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
                  >
                    <option value="">
                      Select client
                    </option>

                    {clients.map((client) => (
                      <option
                        key={client._id}
                        value={client._id}
                      >
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Date *
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Start Time *
                  </label>

                  <input
                    type="time"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    End Time *
                  </label>

                  <input
                    type="time"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Duration
                  </label>

                  <select
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
                  >
                    <option value={30}>
                      30 minutes
                    </option>

                    <option value={45}>
                      45 minutes
                    </option>

                    <option value={60}>
                      60 minutes
                    </option>

                    <option value={90}>
                      90 minutes
                    </option>
                  </select>
                </div>

              </div>

              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-gray-300 px-5 py-3 font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-black px-5 py-3 font-medium text-white disabled:opacity-50"
                >
                  {saving
                    ? "Booking..."
                    : "Book Session"}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* Sessions */}

        <section className="mt-6 rounded-2xl bg-white shadow-sm">

          <div className="border-b p-6">

            <div className="flex items-center gap-3">

              <CalendarDays size={22} />

              <div>
                <h2 className="text-xl font-semibold">
                  Upcoming & Scheduled Sessions
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {sessions.length} total session
                  {sessions.length !== 1 ? "s" : ""}
                </p>
              </div>

            </div>

          </div>

          {sessions.length === 0 ? (
            <div className="p-12 text-center">

              <CalendarDays
                size={40}
                className="mx-auto text-gray-400"
              />

              <h3 className="mt-4 font-semibold">
                No sessions yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Book your first session.
              </p>

            </div>
          ) : (
            <div className="divide-y">

              {sessions.map((session) => (

                <div
                  key={session._id}
                  className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                      <CalendarDays size={21} />
                    </div>

                    <div>

                      <h3 className="font-semibold">
                        {session.client?.name ||
                          "Client"}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {formatDate(session.date)}
                      </p>

                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={15} />
                        {session.startTime} -
                        {session.endTime}
                      </div>

                    </div>

                  </div>

                  <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize">
                    {session.status}
                  </span>

                </div>

              ))}

            </div>
          )}

        </section>

      </div>

    </main>
  );
}

export default Schedule;