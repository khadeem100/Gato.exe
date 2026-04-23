import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CalendarClock,
  Users,
  RefreshCw,
} from "lucide-react";
import api from "../api";

function formatCurrency(val, sign = "\u20AC") {
  return sign + " " + Number(val || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function StatRow({ label, value, sub }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gato-800/50 last:border-0">
      <span className="text-sm text-gato-400">{label}</span>
      <div className="text-right">
        <span className="text-sm font-medium text-gato-200">{value}</span>
        {sub && <p className="text-[11px] text-gato-500">{sub}</p>}
      </div>
    </div>
  );
}

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const d = await api.getAnalytics();
      setData(d);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-gato-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const sign = data?.currency_sign || "\u20AC";
  const po = data?.preorders || {};
  const q = data?.quotes || {};
  const cust = data?.customers || {};

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="text-sm text-gato-500 mt-0.5">
            Performance overview and insights
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pre-Order Analytics */}
        <div className="card">
          <h2 className="section-title flex items-center gap-2 mb-4">
            <CalendarClock size={14} /> Pre-Order Analytics
          </h2>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-gato-800/40 rounded-lg text-center">
              <p className="text-lg font-bold text-amber-400">{po.overdue || 0}</p>
              <p className="text-[10px] text-gato-500 uppercase">Overdue</p>
            </div>
            <div className="p-3 bg-gato-800/40 rounded-lg text-center">
              <p className="text-lg font-bold text-blue-400">{po.due_this_week || 0}</p>
              <p className="text-[10px] text-gato-500 uppercase">Due This Week</p>
            </div>
            <div className="p-3 bg-gato-800/40 rounded-lg text-center">
              <p className="text-lg font-bold text-gato-200">{po.due_this_month || 0}</p>
              <p className="text-[10px] text-gato-500 uppercase">Due This Month</p>
            </div>
            <div className="p-3 bg-gato-800/40 rounded-lg text-center">
              <p className="text-lg font-bold text-emerald-400">
                {po.converted_this_month || 0}
              </p>
              <p className="text-[10px] text-gato-500 uppercase">Converted</p>
            </div>
          </div>

          <StatRow
            label="Pending Value"
            value={formatCurrency(po.pending_value, sign)}
          />

          {/* Status Breakdown */}
          {po.by_status && po.by_status.length > 0 && (
            <div className="mt-3 space-y-1.5">
              <p className="text-[11px] text-gato-600 uppercase">By Status</p>
              {po.by_status.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-gato-400 capitalize">{s.status}</span>
                  <span className="text-gato-300">
                    {s.count} ({formatCurrency(s.total_value, sign)})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quote Pipeline */}
        <div className="card">
          <h2 className="section-title flex items-center gap-2 mb-4">
            <BarChart3 size={14} /> Quote Pipeline
          </h2>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-gato-800/40 rounded-lg text-center">
              <p className="text-lg font-bold text-gato-200">{q.total_quotes || 0}</p>
              <p className="text-[10px] text-gato-500 uppercase">Total Quotes</p>
            </div>
            <div className="p-3 bg-gato-800/40 rounded-lg text-center">
              <p className="text-lg font-bold text-emerald-400">
                {q.converted_quotes || 0}
              </p>
              <p className="text-[10px] text-gato-500 uppercase">Converted</p>
            </div>
          </div>

          <StatRow
            label="Conversion Rate"
            value={`${q.conversion_rate || 0}%`}
          />
          <StatRow
            label="Pipeline Value"
            value={formatCurrency(q.pipeline_value, sign)}
          />

          {/* Expiring Soon */}
          {q.expiring_soon && q.expiring_soon.length > 0 && (
            <div className="mt-4">
              <p className="text-[11px] text-gato-600 uppercase mb-2 flex items-center gap-1">
                <AlertTriangle size={10} /> Expiring Soon
              </p>
              {q.expiring_soon.map((qs, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs py-1.5"
                >
                  <span className="text-gato-300 truncate">
                    {qs.company || `${qs.firstname} ${qs.lastname}`}
                  </span>
                  <span className="text-amber-400 shrink-0 ml-2">
                    {qs.days_until_expiry}d left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Customer Analytics */}
        <div className="card">
          <h2 className="section-title flex items-center gap-2 mb-4">
            <Users size={14} /> Customer Insights
          </h2>

          {/* Top Customers */}
          {cust.top_customers && cust.top_customers.length > 0 && (
            <div className="mb-4">
              <p className="text-[11px] text-gato-600 uppercase mb-2">
                Top Customers
              </p>
              {cust.top_customers.slice(0, 5).map((tc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-gato-800/30 last:border-0"
                >
                  <span className="text-gato-300 truncate">
                    {tc.company || `${tc.firstname} ${tc.lastname}`}
                  </span>
                  <span className="text-gato-200 font-medium shrink-0 ml-2">
                    {formatCurrency(tc.total_revenue, sign)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Customer Segments */}
          {cust.customer_segments && cust.customer_segments.length > 0 && (
            <div>
              <p className="text-[11px] text-gato-600 uppercase mb-2">
                Segments
              </p>
              {cust.customer_segments.map((seg, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs py-1.5"
                >
                  <span className="text-gato-400 capitalize">
                    {seg.segment || "Other"}
                  </span>
                  <span className="text-gato-300">
                    {seg.count} customers
                  </span>
                </div>
              ))}
            </div>
          )}

          {(!cust.top_customers || cust.top_customers.length === 0) &&
            (!cust.customer_segments || cust.customer_segments.length === 0) && (
              <p className="text-sm text-gato-500 py-4 text-center">
                No customer analytics data yet
              </p>
            )}
        </div>
      </div>

      {/* Monthly Trend */}
      {po.monthly_trend && po.monthly_trend.length > 0 && (
        <div className="card">
          <h2 className="section-title flex items-center gap-2 mb-4">
            <TrendingUp size={14} /> Monthly Pre-Order Trend
          </h2>
          <div className="grid grid-cols-6 gap-2">
            {po.monthly_trend
              .slice()
              .reverse()
              .map((m, i) => (
                <div key={i} className="text-center">
                  <div className="h-24 flex items-end justify-center gap-1 mb-1">
                    <div
                      className="w-4 bg-gato-600 rounded-t"
                      style={{
                        height: `${Math.min(
                          100,
                          ((m.total_preorders || 0) /
                            Math.max(
                              1,
                              ...po.monthly_trend.map(
                                (t) => t.total_preorders || 1
                              )
                            )) *
                            100
                        )}%`,
                      }}
                    />
                    <div
                      className="w-4 bg-emerald-600 rounded-t"
                      style={{
                        height: `${Math.min(
                          100,
                          ((m.converted || 0) /
                            Math.max(
                              1,
                              ...po.monthly_trend.map(
                                (t) => t.total_preorders || 1
                              )
                            )) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-gato-500">{m.month}</p>
                  <p className="text-[10px] text-gato-400">
                    {m.total_preorders}
                  </p>
                </div>
              ))}
          </div>
          <div className="flex items-center gap-4 mt-3 justify-center">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded bg-gato-600" />
              <span className="text-[10px] text-gato-500">Total</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded bg-emerald-600" />
              <span className="text-[10px] text-gato-500">Converted</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
