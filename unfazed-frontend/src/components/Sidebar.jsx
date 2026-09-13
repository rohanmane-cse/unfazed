import {
  LayoutDashboard,
  Users,
  CalendarDays,
  FileText,
  CreditCard,
  BarChart3,
  Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const links = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/clients", label: "Clients", icon: Users },
    { to: "/schedule", label: "Schedule", icon: CalendarDays },
    { to: "/notes", label: "Notes", icon: FileText },
    { to: "/payments", label: "Payments", icon: CreditCard },
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white/80 backdrop-blur-sm md:flex">
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
            U
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Unfazed</h2>
            <p className="text-xs text-slate-500">Therapist Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
