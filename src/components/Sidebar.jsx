import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  CalendarClock,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/customers", icon: Users, label: "Customers" },
  { to: "/orders", icon: ShoppingCart, label: "Orders" },
  { to: "/preorders", icon: CalendarClock, label: "Pre-Orders" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-[220px] bg-gato-950 border-r border-gato-800 flex flex-col">
      {/* Drag region + Logo */}
      <div className="titlebar-drag h-[38px] flex items-center px-5">
        <span className="titlebar-no-drag text-sm font-bold tracking-wider text-white">
          GATO<span className="text-gato-400">SPORTS</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-white text-gato-950"
                  : "text-gato-400 hover:text-gato-100 hover:bg-gato-800/60"
              }`
            }
          >
            <item.icon size={18} strokeWidth={1.8} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 pb-4 border-t border-gato-800 pt-4">
        <div className="px-3 mb-3">
          <p className="text-sm font-medium text-gato-200 truncate">
            {user?.firstname} {user?.lastname}
          </p>
          <p className="text-xs text-gato-500 truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gato-500 hover:text-red-400 hover:bg-gato-800/60 transition-all w-full"
        >
          <LogOut size={16} strokeWidth={1.8} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
