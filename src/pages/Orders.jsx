import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Filter,
} from "lucide-react";
import api from "../api";

function formatCurrency(val) {
  return "\u20AC " + Number(val || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      try {
        const data = await api.getOrders({ page, limit: 20 });
        setOrders(data.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page]
  );

  useEffect(() => {
    load();
  }, [load]);

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(() => load(true), 30000);
    return () => clearInterval(interval);
  }, [load]);

  const filtered = search
    ? orders.filter(
        (o) =>
          o.reference.toLowerCase().includes(search.toLowerCase()) ||
          (o.customer.company || "").toLowerCase().includes(search.toLowerCase()) ||
          `${o.customer.firstname} ${o.customer.lastname}`
            .toLowerCase()
            .includes(search.toLowerCase())
      )
    : orders;

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
          <h1 className="page-title">Orders</h1>
          <p className="text-sm text-gato-500 mt-0.5">
            Showing page {page}
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
          placeholder="Search orders by reference or customer..."
          className="w-full pl-10 max-w-md"
        />
      </div>

      {/* Orders Table */}
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
                Payment
              </th>
              <th className="text-right px-5 py-3 text-xs font-medium text-gato-500 uppercase tracking-wider">
                Total
              </th>
              <th className="text-right px-5 py-3 text-xs font-medium text-gato-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gato-500">
                  No orders found
                </td>
              </tr>
            ) : (
              filtered.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => navigate(`/orders/${o.id}`)}
                  className="table-row cursor-pointer"
                >
                  <td className="px-5 py-3 font-mono text-xs text-gato-200">
                    {o.reference}
                  </td>
                  <td className="px-5 py-3 text-gato-300">
                    {o.customer.company ||
                      `${o.customer.firstname} ${o.customer.lastname}`}
                  </td>
                  <td className="px-5 py-3">
                    <span className="badge-info">{o.status}</span>
                  </td>
                  <td className="px-5 py-3 text-gato-400 text-xs">
                    {o.payment}
                  </td>
                  <td className="px-5 py-3 text-right font-medium text-gato-200">
                    {formatCurrency(o.total)}
                  </td>
                  <td className="px-5 py-3 text-right text-xs text-gato-500">
                    {new Date(o.date).toLocaleDateString()}
                  </td>
                </tr>
              ))
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
          disabled={orders.length < 20}
          className="btn-ghost p-2"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
