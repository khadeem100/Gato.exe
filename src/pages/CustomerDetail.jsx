import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Building2,
  MapPin,
  Phone,
  ShoppingCart,
} from "lucide-react";
import api from "../api";

function formatCurrency(val) {
  return "\u20AC " + Number(val || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getCustomer(id)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-gato-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-gato-500">Customer not found</div>
    );
  }

  const { customer, orders, addresses } = data;
  const totalSpent = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/customers")} className="btn-ghost p-2">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="page-title">
            {customer.company || `${customer.firstname} ${customer.lastname}`}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-gato-400 flex items-center gap-1">
              <Mail size={12} /> {customer.email}
            </span>
            {customer.company && (
              <span className="text-sm text-gato-400 flex items-center gap-1">
                <Building2 size={12} /> {customer.firstname} {customer.lastname}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <span className="stat-label">Total Orders</span>
          <span className="stat-value">{orders.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Spent</span>
          <span className="stat-value">{formatCurrency(totalSpent)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Addresses</span>
          <span className="stat-value">{addresses.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders */}
        <div className="lg:col-span-2 card">
          <h2 className="section-title flex items-center gap-2">
            <ShoppingCart size={14} /> Orders
          </h2>
          {orders.length === 0 ? (
            <p className="text-sm text-gato-500 py-4">No orders yet</p>
          ) : (
            <div className="space-y-0 divide-y divide-gato-800/50 -mx-5">
              {orders.map((o) => (
                <div
                  key={o.id}
                  onClick={() => navigate(`/orders/${o.id}`)}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gato-800/30 cursor-pointer transition-colors"
                >
                  <div>
                    <span className="text-sm font-mono text-gato-200">
                      {o.reference}
                    </span>
                    <p className="text-xs text-gato-500">
                      {new Date(o.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gato-200">
                      {formatCurrency(o.total)}
                    </span>
                    <p className="text-xs">
                      <span className="badge-info">{o.status}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Addresses */}
        <div className="card">
          <h2 className="section-title flex items-center gap-2">
            <MapPin size={14} /> Addresses
          </h2>
          {addresses.length === 0 ? (
            <p className="text-sm text-gato-500 py-4">No addresses</p>
          ) : (
            <div className="space-y-4">
              {addresses.map((a) => (
                <div
                  key={a.id}
                  className="p-3 bg-gato-800/40 rounded-lg text-sm"
                >
                  <p className="font-medium text-gato-200 mb-1">
                    {a.alias}
                  </p>
                  {a.company && (
                    <p className="text-gato-400">{a.company}</p>
                  )}
                  <p className="text-gato-400">{a.address1}</p>
                  {a.address2 && (
                    <p className="text-gato-400">{a.address2}</p>
                  )}
                  <p className="text-gato-400">
                    {a.postcode} {a.city}
                  </p>
                  {a.phone && (
                    <p className="text-gato-500 flex items-center gap-1 mt-1">
                      <Phone size={11} /> {a.phone}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
