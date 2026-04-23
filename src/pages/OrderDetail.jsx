import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  FileText,
  Hash,
} from "lucide-react";
import api from "../api";

function formatCurrency(val) {
  return "\u20AC " + Number(val || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function AddressBlock({ title, address, icon: Icon }) {
  if (!address) return null;
  return (
    <div className="p-4 bg-gato-800/40 rounded-lg">
      <h3 className="text-xs font-medium text-gato-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <Icon size={12} /> {title}
      </h3>
      {address.company && (
        <p className="text-sm font-medium text-gato-200">{address.company}</p>
      )}
      <p className="text-sm text-gato-300">{address.address1}</p>
      {address.address2 && (
        <p className="text-sm text-gato-300">{address.address2}</p>
      )}
      <p className="text-sm text-gato-300">
        {address.postcode} {address.city}
      </p>
      {address.phone && (
        <p className="text-xs text-gato-500 mt-1">{address.phone}</p>
      )}
    </div>
  );
}

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getOrder(id)
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
      <div className="text-center py-12 text-gato-500">Order not found</div>
    );
  }

  const { order, customer, products, delivery_address, invoice_address } = data;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/orders")} className="btn-ghost p-2">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="page-title font-mono">{order.reference}</h1>
            <span className="badge-info">{order.status}</span>
          </div>
          <p className="text-sm text-gato-500 mt-0.5">
            {new Date(order.date).toLocaleString()} &middot;{" "}
            {customer.company ||
              `${customer.firstname} ${customer.lastname}`}
          </p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <span className="stat-label">Products</span>
          <span className="stat-value text-lg">
            {formatCurrency(order.total_products)}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Shipping</span>
          <span className="stat-value text-lg">
            {formatCurrency(order.total_shipping)}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Discounts</span>
          <span className="stat-value text-lg">
            -{formatCurrency(order.total_discounts)}
          </span>
        </div>
        <div className="stat-card border-white/10">
          <span className="stat-label">Total</span>
          <span className="stat-value text-lg">{formatCurrency(order.total)}</span>
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
                    {formatCurrency(p.unit_price * p.quantity)}
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
          {/* Payment */}
          <div className="card">
            <h2 className="section-title flex items-center gap-2">
              <CreditCard size={14} /> Payment
            </h2>
            <p className="text-sm text-gato-200">{order.payment || "N/A"}</p>
          </div>

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
            <button
              onClick={() => navigate(`/customers/${customer.id}`)}
              className="text-xs text-gato-400 hover:text-white mt-2 transition-colors"
            >
              View customer &rarr;
            </button>
          </div>

          {/* Addresses */}
          <AddressBlock
            title="Delivery Address"
            address={delivery_address}
            icon={MapPin}
          />
          <AddressBlock
            title="Invoice Address"
            address={invoice_address}
            icon={FileText}
          />
        </div>
      </div>
    </div>
  );
}
