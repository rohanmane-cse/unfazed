import { useEffect, useState } from "react";
import api from "../services/api";

function Schedule() {
  const [sessions, setSessions] = useState([]);
  const [clients, setClients] = useState([]);

  const [formData, setFormData] = useState({
    client: "",
    date: "",
    startTime: "",
    endTime: "",
    duration: 60,
  });

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // GET SESSIONS AND CLIENTS
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const sessionResponse = await api.get(
        "/sessions",
        {
          headers,
        }
      );

      const clientResponse = await api.get(
        "/clients",
        {
          headers,
        }
      );

      setSessions(
        sessionResponse.data.sessions || []
      );

      setClients(
        clientResponse.data.clients || []
      );

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load schedule"
      );
    } finally {
      setLoading(false);
    }
  };

  // LOAD DATA WHEN PAGE OPENS
  useEffect(() => {
    fetchData();
  }, []);

  // FORM INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // CREATE SESSION
  const handleCreateSession = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      setCreating(true);

      const response = await api.post(
        "/sessions",
        {
          ...formData,
          duration: Number(formData.duration),
        },
        {
          headers,
        }
      );

      setMessage(
        response.data.message ||
          "Session booked successfully"
      );

      // CLEAR FORM
      setFormData({
        client: "",
        date: "",
        startTime: "",
        endTime: "",
        duration: 60,
      });

      // REFRESH SESSIONS
      await fetchData();

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create session"
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6">

      <div className="mx-auto max-w-7xl">

        {/* PAGE HEADER */}

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Schedule
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your therapy sessions and appointments.
          </p>
        </div>

        {/* SUCCESS MESSAGE */}

        {message && (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            {message}
          </div>
        )}

        {/* ERROR MESSAGE */}

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {/* BOOK SESSION */}

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-gray-900">
            Book New Session
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Create a new therapy appointment for a client.
          </p>

          <form
            onSubmit={handleCreateSession}
            className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2"
          >

            {/* CLIENT */}

            <div>
              <label className="text-sm font-medium text-gray-700">
                Client
              </label>

              <select
                name="client"
                value={formData.client}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
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

            {/* DATE */}

            <div>
              <label className="text-sm font-medium text-gray-700">
                Date
              </label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            {/* START TIME */}

            <div>
              <label className="text-sm font-medium text-gray-700">
                Start Time
              </label>

              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            {/* END TIME */}

            <div>
              <label className="text-sm font-medium text-gray-700">
                End Time
              </label>

              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            {/* DURATION */}

            <div>
              <label className="text-sm font-medium text-gray-700">
                Duration
              </label>

              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
              >

                <option value="30">
                  30 minutes
                </option>

                <option value="45">
                  45 minutes
                </option>

                <option value="60">
                  60 minutes
                </option>

                <option value="90">
                  90 minutes
                </option>

              </select>
            </div>

            {/* BUTTON */}

            <div className="flex items-end">

              <button
                type="submit"
                disabled={creating}
                className="w-full rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {creating
                  ? "Booking..."
                  : "Book Session"}

              </button>

            </div>

          </form>

        </section>

        {/* ALL SESSIONS */}

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-gray-900">
            All Sessions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            View all your scheduled therapy sessions.
          </p>

          {/* LOADING */}

          {loading ? (

            <p className="mt-6 text-gray-500">
              Loading sessions...
            </p>

          ) : sessions.length === 0 ? (

            /* EMPTY */

            <div className="mt-6 rounded-lg border p-6 text-gray-500">
              No sessions found.
            </div>

          ) : (

            /* SESSION LIST */

            <div className="mt-6 space-y-4">

              {sessions.map((session) => (

                <div
                  key={session._id}
                  className="flex flex-col gap-4 rounded-xl border p-5 md:flex-row md:items-center md:justify-between"
                >

                  {/* CLIENT */}

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {session.client?.name ||
                        "Client"}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {session.client?.email || ""}
                    </p>
                  </div>

                  {/* DATE & TIME */}

                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(
                        session.date
                      ).toLocaleDateString()}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {session.startTime} —{" "}
                      {session.endTime}
                    </p>
                  </div>

                  {/* STATUS */}

                  <div>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                      {session.status}
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

export default Schedule;