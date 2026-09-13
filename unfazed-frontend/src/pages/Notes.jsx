import { useEffect, useState } from "react";
import {
  FileText,
  Plus,
  X,
  Search,
  Lock,
  Users,
  Trash2,
} from "lucide-react";
import api from "../services/api";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [clients, setClients] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    client: "",
    session: "",
    content: "",
    visibility: "private",
  });

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // =========================
  // LOAD DATA
  // =========================

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [notesResponse, clientsResponse] =
        await Promise.all([
          api.get("/notes", authConfig),
          api.get("/clients", authConfig),
        ]);

      setNotes(notesResponse.data.notes || []);
      setClients(clientsResponse.data.clients || []);
    } catch (err) {
      console.error("Notes loading error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load notes"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setForm({
      client: "",
      session: "",
      content: "",
      visibility: "private",
    });
  };

  // =========================
  // CREATE NOTE
  // =========================

  const createNote = async (e) => {
    e.preventDefault();

    if (!form.client) {
      setError("Please select a client");
      return;
    }

    if (!form.session) {
      setError("Please enter the session ID");
      return;
    }

    if (!form.content.trim()) {
      setError("Note content is required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await api.post(
        "/notes",
        {
          client: form.client,
          session: form.session,
          content: form.content,
          visibility: form.visibility,
        },
        authConfig
      );

      resetForm();
      setShowForm(false);

      await loadData();
    } catch (err) {
      console.error("Create note error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to create note"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE NOTE
  // =========================

  const deleteNote = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(
        `/notes/${id}`,
        authConfig
      );

      setNotes((previous) =>
        previous.filter(
          (note) => note._id !== id
        )
      );
    } catch (err) {
      console.error("Delete note error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete note"
      );
    }
  };

  // =========================
  // SEARCH
  // =========================

  const filteredNotes = notes.filter((note) => {
    const text = search.toLowerCase();

    return (
      note.content
        ?.toLowerCase()
        .includes(text) ||
      note.client?.name
        ?.toLowerCase()
        .includes(text)
    );
  });

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-6xl rounded-2xl bg-white p-10 text-center shadow-sm">
          Loading clinical notes...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6">

      <div className="mx-auto max-w-6xl">

        {/* =========================
            HEADER
        ========================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-sm font-medium text-gray-500">
              Therapist Dashboard
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              Clinical Notes
            </h1>

            <p className="mt-2 text-gray-500">
              Securely manage your session notes.
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
            New Note
          </button>

        </div>

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="mt-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">

            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
            >
              <X size={18} />
            </button>

          </div>
        )}

        {/* =========================
            NEW NOTE FORM
        ========================= */}

        {showForm && (
          <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-xl font-semibold text-gray-900">
                  Create Clinical Note
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add notes related to a therapy session.
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
              onSubmit={createNote}
              className="mt-6 space-y-5"
            >

              {/* CLIENT */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
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

              {/* SESSION ID */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Session ID *
                </label>

                <input
                  type="text"
                  name="session"
                  value={form.session}
                  onChange={handleChange}
                  placeholder="Enter session ID"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Use the MongoDB session ID associated with this note.
                </p>

              </div>

              {/* VISIBILITY */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Visibility
                </label>

                <select
                  name="visibility"
                  value={form.visibility}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
                >

                  <option value="private">
                    Private — Therapist only
                  </option>

                  <option value="shared">
                    Shared — Client can see
                  </option>

                </select>

              </div>

              {/* CONTENT */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Note *
                </label>

                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows="8"
                  placeholder="Write your clinical session notes..."
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />

              </div>

              {/* BUTTONS */}

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
                    : "Save Note"}
                </button>

              </div>

            </form>

          </section>
        )}

        {/* =========================
            SEARCH
        ========================= */}

        <section className="mt-6 rounded-2xl bg-white p-4 shadow-sm">

          <div className="relative max-w-md">

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
              placeholder="Search notes or clients..."
              className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-black"
            />

          </div>

        </section>

        {/* =========================
            NOTES
        ========================= */}

        <section className="mt-6">

          {filteredNotes.length === 0 ? (

            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">

                <FileText
                  size={30}
                  className="text-gray-500"
                />

              </div>

              <h2 className="mt-4 text-lg font-semibold">
                {search
                  ? "No notes found"
                  : "No clinical notes yet"}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {search
                  ? "Try another search."
                  : "Create your first clinical note."}
              </p>

            </div>

          ) : (

            <div className="grid gap-5 md:grid-cols-2">

              {filteredNotes.map((note) => (

                <article
                  key={note._id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >

                  {/* HEADER */}

                  <div className="flex items-start justify-between">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">

                        <FileText size={20} />

                      </div>

                      <div>

                        <h3 className="font-semibold text-gray-900">
                          {note.client?.name ||
                            "Client"}
                        </h3>

                        <p className="text-xs text-gray-500">
                          {note.createdAt
                            ? new Date(
                                note.createdAt
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "Date unavailable"}
                        </p>

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        deleteNote(note._id)
                      }
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                      title="Delete note"
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>

                  {/* VISIBILITY */}

                  <div className="mt-4">

                    {note.visibility ===
                    "shared" ? (

                      <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">

                        <Users size={13} />

                        Shared with client

                      </span>

                    ) : (

                      <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">

                        <Lock size={13} />

                        Private

                      </span>

                    )}

                  </div>

                  {/* CONTENT */}

                  <div className="mt-5 rounded-xl bg-gray-50 p-4">

                    <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                      {note.content}
                    </p>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </div>

    </main>
  );
}

export default Notes;