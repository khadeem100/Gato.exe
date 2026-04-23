import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  MapPin,
  CalendarClock,
  CreditCard,
  FileText,
  Hash,
  Tag,
  StickyNote,
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

export default function PreorderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getPreorder(id)
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
      <div className="text-center py-12 text-gato-500">Pre-order not found</div>
    );
  }

  const { preorder, customer, products, delivery_address } = data;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/preorders")} className="btn-ghost p-2">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="page-title font-mono">{preorder.reference}</h1>
            <span className={statusBadge(preorder.status)}>
              {preorder.status}
            </span>
          </div>
          <p className="text-sm text-gato-500 mt-0.5">
            Created {new Date(preorder.date).toLocaleDateString()} &middot;{" "}
            {customer.company ||
              `${customer.firstname} ${customer.lastname}`}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <span className="stat-label">Products</span>
          <span className="stat-value text-lg">
            {formatCurrency(preorder.total_products)}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Discount</span>
          <span className="stat-value text-lg">
            -{formatCurrency(preorder.total_discount)}
          </span>
        </div>
        <div className="stat-card border-white/10">
          <span className="stat-label">Total</span>
          <span className="stat-value text-lg">{formatCurrency(preorder.total)}</span>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-1.5 mb-1">
            <CalendarClock size={14} className="text-gato-400" />
            <span className="stat-label">Due Date</span>
          </div>
          <span className="text-lg font-bold text-white">
            {new Date(preorder.due_date).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products */}
        <div className="lg:col-span-2 card">
          <h2 className="section-title flex items-center gap-2">
            <Package size={14} /> Products
          </h2>
          <div className="space-y-0 divide-y divide-gato-800/50 -mx-5">
            {products.map((p, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gato-200 truncate">{p.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {p.reference && (
                      <span className="text-xs text-gato-500 font-mono flex items-center gap-0.5">
                        <Hash size={10} />
                        {p.reference}
                      </span>
                    )}
                    <span className="text-xs text-gato-500">
                      Qty: {p.quantity}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-sm font-medium text-gato-200">
                    {formatCurrency(p.total)}
                  </p>
                  <p className="text-xs text-gato-500">
                    {formatCurrency(p.unit_price)} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Customer */}
          <div className="card">
            <h2 className="section-title flex items-center gap-2">
              <FileText size={14} /> Customer
            </h2>
            <p className="text-sm font-medium text-gato-200">
              {customer.company ||
                `${customer.firstname} ${customer.lastname}`}
            </p>
            <p className="text-xs text-gato-400 mt-0.5">{customer.email}</p>
          </div>

          {/* Details */}
          <div className="card space-y-3">
            <h2 className="section-title flex items-center gap-2">
              <Tag size={14} /> Details
            </h2>
            {preorder.purchase_reference && (
              <div>
                <p className="text-[11px] text-gato-500 uppercase">Purchase Ref</p>
                <p className="text-sm text-gato-200">{preorder.purchase_reference}</p>
              </div>
            )}
            {preorder.payment_method && (
              <div>
                <p className="text-[11px] text-gato-500 uppercase">Payment</p>
                <p className="text-sm text-gato-200 flex items-center gap-1">
                  <CreditCard size={12} /> {preorder.payment_method}
                </p>
              </div>
            )}
            {preorder.discount && (
              <div>
                <p className="text-[11px] text-gato-500 uppercase">Discount</p>
                <p className="text-sm text-gato-200">{preorder.discount}</p>
              </div>
            )}
          </div>

          {/* Notes */}
          {preorder.notes && (
            <div className="card">
              <h2 className="section-title flex items-center gap-2">
                <StickyNote size={14} /> Notes
              </h2>
              <p className="text-sm text-gato-300 whitespace-pre-wrap">
                {preorder.notes}
              </p>
            </div>
          )}

          {/* Delivery Address */}
          {delivery_address && (
            <div className="card">
              <h2 className="section-title flex items-center gap-2">
                <MapPin size={14} /> Delivery Address
              </h2>
              {delivery_address.company && (
                <p className="text-sm font-medium text-gato-200">
                  {delivery_address.company}
                </p>
              )}
              <p className="text-sm text-gato-300">{delivery_address.address1}</p>
              {delivery_address.address2 && (
                <p className="text-sm text-gato-300">{delivery_address.address2}</p>
              )}
              <p className="text-sm text-gato-300">
                {delivery_address.postcode} {delivery_address.city}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
