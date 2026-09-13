import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

import Dashboard from "../pages/Dashboard";
import Clients from "../pages/Clients";
import ClientDetails from "../pages/ClientDetails";

import ClientPortal from "../pages/ClientPortal";
import PublicTherapist from "../pages/PublicTherapist";
import ClientIntake from "../pages/ClientIntake";

import Schedule from "../pages/Schedule";
import Notes from "../pages/Notes";
import Payments from "../pages/Payments";
import Chat from "../pages/Chat";
import Analytics from "../pages/Analytics";
import Settings from "../pages/Settings";

import ProtectedRoute from "./ProtectedRoute";

function DashboardLayout({ children }) {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="dashboard-main">{children}</main>
    </div>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />

        <Routes>

        {/* =========================
            HOME
        ========================= */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* =========================
            AUTHENTICATION
        ========================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =========================
            THERAPIST DASHBOARD
        ========================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />


        {/* =========================
            SCHEDULE
        ========================= */}

        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Schedule />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />


        {/* =========================
            CLIENTS
        ========================= */}

        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Clients />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />


        {/* =========================
            CLIENT DETAILS
        ========================= */}

        <Route
          path="/clients/:id"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ClientDetails />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />


        {/* =========================
            CLINICAL NOTES
        ========================= */}

        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Notes />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />


        {/* =========================
            PAYMENTS
        ========================= */}

        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Payments />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />


        {/* =========================
            CHAT
        ========================= */}

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Chat />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />


        {/* =========================
            ANALYTICS
        ========================= */}

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Analytics />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />


        {/* =========================
            SETTINGS
        ========================= */}

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />


        {/* =========================
            CLIENT PORTAL
        ========================= */}

        <Route
          path="/portal"
          element={<ClientPortal />}
        />


        {/* =========================
            PUBLIC THERAPIST PROFILE
        ========================= */}

        <Route
          path="/therapist/:slug"
          element={<PublicTherapist />}
        />


        {/* =========================
            CLIENT INTAKE
        ========================= */}

        <Route
          path="/intake"
          element={<ClientIntake />}
        />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default AppRoutes;