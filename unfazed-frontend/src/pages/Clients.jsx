import { useEffect, useState } from "react";
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Trash2,
  X,
} from "lucide-react";
import api from "../services/api";

function Clients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    presentingConcern: "",
    history: "",
    consentGiven: false,
  });

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const loadClients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/clients",
        authConfig
      );

      setClients(response.data.clients || []);
    } catch (err) {
      console.error("Clients error:", err);

      setError(
        err.response?.data?.message ||
        "Failed to load clients"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      presentingConcern: "",
      history: "",
      consentGiven: false,
    });
  };

  const handleAddClient = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("Client name is required");
      return;
    }

    if (!form.email.trim()) {
      setError("Client email is required");
      return;
    }

    if (!form.consentGiven) {
      setError("Client consent is required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await api.post(
        "/clients",
        form,
        authConfig
      );

      const newClient = response.data.client;

      setClients((previous) => [
        newClient,
        ...previous,
      ]);

      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("Add client error:", err);

      setError(
        err.response?.data?.message ||
        "Failed to add client"
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteClient = async (clientId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this client?"
    );

    if (!confirmed) return;

    try {
      await api.delete(
        `/clients/${clientId}`,
        authConfig
      );

      setClients((previous) =>
        previous.filter(
          (client) => client._id !== clientId
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to delete client"
      );
    }
  };

  const filteredClients = clients.filter((client) => {
    const searchText = search.toLowerCase();

    return (
      client.name
        ?.toLowerCase()
        .includes(searchText) ||
      client.email
        ?.toLowerCase()
        .includes(searchText) ||
      client.phone
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-gray-500">
              Loading clients...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm font-medium text-gray-500">
              Therapist Dashboard
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              Clients
            </h1>

            <p className="mt-2 text-gray-500">
              Manage your clients and their information.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setError("");
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 font-medium text-white hover:bg-gray-800"
          >
            <Plus size={18} />
            Add Client
          </button>

        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="ml-4"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Add Client Form */}
        {showForm && (
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Add New Client
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter the client's information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                  setError("");
                }}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleAddClient}
              className="mt-6 space-y-5"
            >

              <div className="grid gap-5 md:grid-cols-2">

                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Client name"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email *
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="client@example.com"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Phone
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  />
                </div>

                {/* Presenting Concern */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Presenting Concern
                  </label>

                  <input
                    type="text"
                    name="presentingConcern"
                    value={form.presentingConcern}
                    onChange={handleChange}
                    placeholder="e.g. Anxiety"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  />
                </div>

              </div>

              {/* History */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  History
                </label>

                <textarea
                  name="history"
                  value={form.history}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Relevant client history..."
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              {/* Consent */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

                <label className="flex cursor-pointer items-start gap-3">

                  <input
                    type="checkbox"
                    name="consentGiven"
                    checked={form.consentGiven}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4"
                  />

                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Client consent *
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      I confirm that the client has provided
                      consent for their information to be
                      stored and managed on Unfazed.
                    </p>
                  </div>

                </label>

              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-black px-5 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Add Client"}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* Search */}
        <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="relative w-full sm:max-w-md">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search clients..."
                className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-black"
              />

            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users size={18} />

              <span>
                {filteredClients.length} client
                {filteredClients.length !== 1
                  ? "s"
                  : ""}
              </span>
            </div>

          </div>

        </div>

        {/* Client List */}
        <div className="mt-6">

          {filteredClients.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Users
                  size={30}
                  className="text-gray-500"
                />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-gray-900">
                {search
                  ? "No clients found"
                  : "No clients yet"}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {search
                  ? "Try another search."
                  : "Add your first client to get started."}
              </p>

            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

              {filteredClients.map((client) => (
                <div
                  key={client._id}
                  className="rounded-2xl bg-white p-5 shadow-sm"
                >

                  <div className="flex items-start justify-between">

                    <div className="flex items-center gap-3">

                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-lg font-semibold text-gray-700">
                        {client.name
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <h2 className="font-semibold text-gray-900">
                          {client.name}
                        </h2>

                        <p className="text-xs text-gray-500">
                          Client
                        </p>
                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        deleteClient(client._id)
                      }
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                      title="Delete client"
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>

                  <div className="mt-5 space-y-3">

                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Mail size={16} />
                      <span className="truncate">
                        {client.email}
                      </span>
                    </div>

                    {client.phone && (
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Phone size={16} />
                        <span>{client.phone}</span>
                      </div>
                    )}

                  </div>

                  {client.presentingConcern && (
                    <div className="mt-5 rounded-xl bg-gray-50 p-3">

                      <p className="text-xs font-medium text-gray-500">
                        Presenting Concern
                      </p>

                      <p className="mt-1 text-sm text-gray-700">
                        {client.presentingConcern}
                      </p>

                    </div>
                  )}

                  <div className="mt-5 flex items-center justify-between border-t pt-4">

                    <span className="text-xs text-gray-500">
                      Consent
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        client.consentGiven
                          ? "bg-gray-100 text-gray-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {client.consentGiven
                        ? "Given"
                        : "Not given"}
                    </span>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </main>
  );
}

export default Clients;