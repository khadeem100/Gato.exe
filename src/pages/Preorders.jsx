import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  CalendarClock,
  AlertTriangle,
} from "lucide-react";
import api from "../api";

function formatCurrency(val) {
  return "\u20AC " + Number(val || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function statusBadge(status) {
  const map = {
    pending: "badge bg-gato-800 text-amber-400 border border-amber-400/20",
    confirmed: "badge bg-gato-800 text-blue-400 border border-blue-400/20",
    converted: "badge bg-gato-800 text-emerald-400 border border-emerald-400/20",
    cancelled: "badge bg-gato-800 text-red-400 border border-red-400/20",
  };
  return map[status] || "badge-info";
}

function daysUntil(dateStr) {
  const diff = Math.ceil(
    (new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (diff < 0) return { text: `${Math.abs(diff)}d overdue`, overdue: true };
  if (diff === 0) return { text: "Due today", overdue: false };
  return { text: `${diff}d`, overdue: false };
}

export default function Preorders() {
  const navigate = useNavigate();
  const [preorders, setPreorders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      try {
        const params = { page, limit: 20 };
        if (statusFilter) params.status = statusFilter;
        const data = await api.getPreorders(params);
        setPreorders(data.preorders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, statusFilter]
  );

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const interval = setInterval(() => load(true), 30000);
    return () => clearInterval(interval);
  }, [load]);

  const filtered = search
    ? preorders.filter(
        (p) =>
          p.reference.toLowerCase().includes(search.toLowerCase()) ||
          (p.customer.company || "").toLowerCase().includes(search.toLowerCase()) ||
          `${p.customer.firstname} ${p.customer.lastname}`
            .toLowerCase()
            .includes(search.toLowerCase())
      )
    : preorders;

  if (loading && !refreshing) {
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
          <h1 className="page-title">Pre-Orders</h1>
          <p className="text-sm text-gato-500 mt-0.5">
            Manage pre-orders for your customers
          </p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="btn-secondary"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gato-500"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by reference or customer..."
            className="w-full pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="w-40"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="converted">Converted</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Preorders Table */}
      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gato-800 bg-gato-900">
              <th className="text-left px-5 py-3 text-xs font-medium text-gato-500 uppercase tracking-wider">
                Reference
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gato-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gato-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gato-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="text-right px-5 py-3 text-xs font-medium text-gato-500 uppercase tracking-wider">
                Total
              </th>
              <th className="text-right px-5 py-3 text-xs font-medium text-gato-500 uppercase tracking-wider">
                Created
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gato-500">
                  No pre-orders found
                </td>
              </tr>
            ) : (
              filtered.map((po) => {
                const due = daysUntil(po.due_date);
                return (
                  <tr
                    key={po.id}
                    onClick={() => navigate(`/preorders/${po.id}`)}
                    className="table-row cursor-pointer"
                  >
                    <td className="px-5 py-3 font-mono text-xs text-gato-200">
                      {po.reference}
                    </td>
                    <td className="px-5 py-3 text-gato-300">
                      {po.customer.company ||
                        `${po.customer.firstname} ${po.customer.lastname}`}
                    </td>
                    <td className="px-5 py-3">
                      <span className={statusBadge(po.status)}>
                        {po.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        {due.overdue && (
                          <AlertTriangle size={12} className="text-red-400" />
                        )}
                        <CalendarClock size={12} className="text-gato-500" />
                        <span
                          className={`text-xs ${
                            due.overdue ? "text-red-400 font-medium" : "text-gato-400"
                          }`}
                        >
                          {new Date(po.due_date).toLocaleDateString()}{" "}
                          <span className="text-gato-600">({due.text})</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-gato-200">
                      {formatCurrency(po.total)}
                    </td>
                    <td className="px-5 py-3 text-right text-xs text-gato-500">
                      {new Date(po.date).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="btn-ghost p-2"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm text-gato-400 px-3">Page {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={preorders.length < 20}
          className="btn-ghost p-2"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
