import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Users, Building2, ChevronRight } from "lucide-react";
import api from "../api";

export default function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .getCustomers()
      .then((d) => setCustomers(d.customers || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search) return customers;
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        (c.company || "").toLowerCase().includes(q) ||
        c.firstname.toLowerCase().includes(q) ||
        c.lastname.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [customers, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-gato-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="text-sm text-gato-500 mt-0.5">
            {customers.length} total customers
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gato-500"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, company, or email..."
          className="w-full pl-10 max-w-md"
        />
      </div>

      {/* Customer List */}
      <div className="card p-0 divide-y divide-gato-800/50">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gato-500 text-sm">
            No customers found
          </div>
        ) : (
          filtered.map((c) => (
            <div
              key={c.id_customer}
              onClick={() => navigate(`/customers/${c.id_customer}`)}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-gato-800/30 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-gato-800 flex items-center justify-center shrink-0">
                  {c.company ? (
                    <Building2 size={16} className="text-gato-400" />
                  ) : (
                    <Users size={16} className="text-gato-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gato-200 truncate">
                    {c.company || `${c.firstname} ${c.lastname}`}
                  </p>
                  <p className="text-xs text-gato-500 truncate">
                    {c.company
                      ? `${c.firstname} ${c.lastname}`
                      : c.email}
                  </p>
                </div>
              </div>
              <ChevronRight
                size={16}
                className="text-gato-600 group-hover:text-gato-400 transition-colors shrink-0"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
