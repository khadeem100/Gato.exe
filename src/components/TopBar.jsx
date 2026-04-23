import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { RefreshCw } from "lucide-react";

const pageTitles = {
  "/": "Dashboard",
  "/customers": "Customers",
  "/orders": "Orders",
  "/preorders": "Pre-Orders",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

export default function TopBar() {
  const location = useLocation();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const path = location.pathname;
  let title = pageTitles[path] || "";
  if (path.startsWith("/customers/")) title = "Customer Details";
  if (path.startsWith("/orders/")) title = "Order Details";
  if (path.startsWith("/preorders/")) title = "Pre-Order Details";

  return (
    <div className="titlebar-drag h-[38px] bg-gato-950 border-b border-gato-800 flex items-center justify-between px-4">
      <div className="titlebar-no-drag flex items-center gap-3">
        <h1 className="text-sm font-medium text-gato-300">{title}</h1>
      </div>
      <div className="titlebar-no-drag flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] text-gato-500">Live</span>
        </div>
        <span className="text-[11px] text-gato-500 font-mono">
          {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}
