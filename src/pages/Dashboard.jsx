import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Package,
  RefreshCw,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import api from "../api";

function formatCurrency(val) {
  return "\u20AC " + Number(val || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const d = await api.getDashboard();
      setData(d);
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(() => load(), 60000);
    return () => clearInterval(interval);
  }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-gato-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-sm text-gato-500 mt-0.5">
            Real-time overview of your sales activity
          </p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="btn-secondary"
        >
          <RefreshCw
            size={14}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Orders This Month</span>
            <ShoppingCart size={16} className="text-gato-600" />
          </div>
          <span className="stat-value">{data?.orders_this_month || 0}</span>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Revenue This Month</span>
            <DollarSign size={16} className="text-gato-600" />
          </div>
          <span className="stat-value">
            {formatCurrency(data?.revenue_this_month)}
          </span>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Total Orders</span>
            <Package size={16} className="text-gato-600" />
          </div>
          <span className="stat-value">{data?.total_orders || 0}</span>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Avg Order Value</span>
            <TrendingUp size={16} className="text-gato-600" />
          </div>
          <span className="stat-value">
            {data?.total_orders
              ? formatCurrency(
                  (data?.revenue_this_month || 0) /
                    Math.max(1, data?.orders_this_month || 1)
                )
              : "\u20AC 0.00"}
          </span>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gato-200">Recent Orders</h2>
          <button
            onClick={() => navigate("/orders")}
            className="text-xs text-gato-400 hover:text-white transition-colors flex items-center gap-1"
          >
            View all <ArrowUpRight size={12} />
          </button>
        </div>

        {!data?.recent_orders?.length ? (
          <p className="text-sm text-gato-500 py-8 text-center">
            No recent orders
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gato-800">
                  <th className="text-left py-2 text-xs font-medium text-gato-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="text-left py-2 text-xs font-medium text-gato-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left py-2 text-xs font-medium text-gato-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right py-2 text-xs font-medium text-gato-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="text-right py-2 text-xs font-medium text-gato-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.recent_orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="table-row cursor-pointer"
                  >
                    <td className="py-3 font-mono text-xs text-gato-200">
                      {order.reference}
                    </td>
                    <td className="py-3 text-gato-300">{order.customer_name}</td>
                    <td className="py-3">
                      <span className="badge-info">{order.status}</span>
                    </td>
                    <td className="py-3 text-right font-medium text-gato-200">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="py-3 text-right text-gato-500 flex items-center justify-end gap-1">
                      <Clock size={12} />
                      {timeAgo(order.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
