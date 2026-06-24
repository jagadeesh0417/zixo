"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPercent,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiCopy,
  FiToggleLeft,
  FiToggleRight,
  FiSave,
  FiX,
  FiTag,
  FiBox,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { formatDate, formatPrice } from "@/lib/utils";

const sampleCoupons = [
  {
    id: "cp1",
    code: "WELCOME20",
    description: "Welcome discount for new customers",
    type: "PERCENTAGE",
    value: 20,
    minOrder: 499,
    maxDiscount: 200,
    usageLimit: 100,
    usedCount: 34,
    isActive: true,
    expiresAt: "2026-12-31",
  },
  {
    id: "cp2",
    code: "FREESHIP",
    description: "Free shipping on all orders",
    type: "FREE_SHIPPING",
    value: 0,
    minOrder: 299,
    maxDiscount: null,
    usageLimit: 200,
    usedCount: 89,
    isActive: true,
    expiresAt: "2026-08-15",
  },
  {
    id: "cp3",
    code: "FLAT150",
    description: "Flat \u20B9150 off on orders above \u20B9999",
    type: "FIXED",
    value: 150,
    minOrder: 999,
    maxDiscount: null,
    usageLimit: 50,
    usedCount: 12,
    isActive: true,
    expiresAt: "2026-07-01",
  },
  {
    id: "cp4",
    code: "SUMMER25",
    description: "Summer special 25% off",
    type: "PERCENTAGE",
    value: 25,
    minOrder: 799,
    maxDiscount: 500,
    usageLimit: 75,
    usedCount: 45,
    isActive: false,
    expiresAt: "2026-06-15",
  },
  {
    id: "cp5",
    code: "COOKIE10",
    description: "10% off on cookie boxes",
    type: "PERCENTAGE",
    value: 10,
    minOrder: null,
    maxDiscount: 100,
    usageLimit: null,
    usedCount: 156,
    isActive: true,
    expiresAt: "2026-09-30",
  },
  {
    id: "cp6",
    code: "FESTIVE50",
    description: "Festive season \u20B950 off",
    type: "FIXED",
    value: 50,
    minOrder: 299,
    maxDiscount: null,
    usageLimit: 500,
    usedCount: 210,
    isActive: true,
    expiresAt: "2026-11-15",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface CouponForm {
  code: string;
  description: string;
  type: string;
  value: string;
  minOrder: string;
  maxDiscount: string;
  usageLimit: string;
  expiresAt: string;
  isActive: boolean;
}

const emptyForm: CouponForm = {
  code: "",
  description: "",
  type: "PERCENTAGE",
  value: "",
  minOrder: "",
  maxDiscount: "",
  usageLimit: "",
  expiresAt: "",
  isActive: true,
};

function getExpiryColor(expiresAt: string): string {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "text-red-600 bg-red-50";
  if (diffDays <= 7) return "text-yellow-600 bg-yellow-50";
  return "text-green-600 bg-green-50";
}

function getTypeBadge(type: string): string {
  switch (type) {
    case "PERCENTAGE": return "bg-blue-50 text-blue-700";
    case "FIXED": return "bg-purple-50 text-purple-700";
    case "FREE_SHIPPING": return "bg-teal-50 text-teal-700";
    default: return "bg-gray-50 text-gray-700";
  }
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState(sampleCoupons);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CouponForm>(emptyForm);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  const filteredCoupons = useMemo(() => {
    return coupons;
  }, [coupons]);

  const totalPages = Math.ceil(filteredCoupons.length / perPage);
  const paginatedCoupons = filteredCoupons.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied ${code}`);
  };

  const handleDelete = (id: string, code: string) => {
    if (window.confirm(`Are you sure you want to delete coupon "${code}"?`)) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      toast.success(`Coupon "${code}" deleted`);
    }
  };

  const handleToggleActive = (id: string, code: string, current: boolean) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !current } : c))
    );
    toast.success(`"${code}" ${current ? "deactivated" : "activated"}`);
  };

  const openCreateForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (coupon: typeof sampleCoupons[0]) => {
    setForm({
      code: coupon.code,
      description: coupon.description || "",
      type: coupon.type,
      value: String(coupon.value),
      minOrder: coupon.minOrder !== null ? String(coupon.minOrder) : "",
      maxDiscount: coupon.maxDiscount !== null ? String(coupon.maxDiscount) : "",
      usageLimit: coupon.usageLimit !== null ? String(coupon.usageLimit) : "",
      expiresAt: coupon.expiresAt || "",
      isActive: coupon.isActive,
    });
    setEditingId(coupon.id);
    setShowForm(true);
  };

  const handleCreateCoupon = () => {
    toast.success("Coupon created!");
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleUpdateCoupon = () => {
    toast.success("Coupon updated!");
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter((c) => c.isActive).length;
  const totalUsage = coupons.reduce((sum, c) => sum + c.usedCount, 0);
  const expiredCoupons = coupons.filter((c) => c.expiresAt && new Date(c.expiresAt) < new Date()).length;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-chocolate">Coupons</h1>
          <p className="text-gray-500 mt-1">Manage promotional coupons and discounts</p>
        </div>
        <button
          onClick={openCreateForm}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-caramel text-chocolate rounded-xl font-medium text-sm hover:bg-caramel/90 transition-all hover:shadow-lg hover:shadow-caramel/25 self-start"
        >
          <FiPlus size={16} />
          Create Coupon
        </button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Coupons", value: totalCoupons, icon: FiTag, color: "text-blue-600 bg-blue-50" },
          { label: "Active", value: activeCoupons, icon: FiCheckCircle, color: "text-green-600 bg-green-50" },
          { label: "Total Usage", value: totalUsage, icon: FiBox, color: "text-purple-600 bg-purple-50" },
          { label: "Expired", value: expiredCoupons, icon: FiAlertCircle, color: "text-red-600 bg-red-50" },
        ].map((stat) => (
          <div key={stat.label} className="admin-card flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${stat.color}`}>
              <stat.icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-chocolate">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            className="admin-card mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-chocolate">
                {editingId ? "Edit Coupon" : "Create New Coupon"}
              </h3>
              <button
                onClick={() => { setShowForm(false); setForm(emptyForm); setEditingId(null); }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SAVE20"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-chocolate placeholder:text-gray-400 focus:outline-none focus:border-caramel focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description of the coupon"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-chocolate placeholder:text-gray-400 focus:outline-none focus:border-caramel focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-chocolate focus:outline-none focus:border-caramel transition-all"
                >
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED">Fixed Amount</option>
                  <option value="FREE_SHIPPING">Free Shipping</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Value {form.type === "PERCENTAGE" ? "(%)" : form.type === "FIXED" ? "(₹)" : "—"}
                </label>
                <input
                  type="number"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  placeholder={form.type === "PERCENTAGE" ? "e.g. 20" : form.type === "FIXED" ? "e.g. 150" : "0"}
                  disabled={form.type === "FREE_SHIPPING"}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-chocolate placeholder:text-gray-400 focus:outline-none focus:border-caramel focus:bg-white transition-all disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Min Order Amount (₹)</label>
                <input
                  type="number"
                  value={form.minOrder}
                  onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
                  placeholder="Optional"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-chocolate placeholder:text-gray-400 focus:outline-none focus:border-caramel focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Max Discount (₹)</label>
                <input
                  type="number"
                  value={form.maxDiscount}
                  onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                  placeholder="Optional"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-chocolate placeholder:text-gray-400 focus:outline-none focus:border-caramel focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Usage Limit</label>
                <input
                  type="number"
                  value={form.usageLimit}
                  onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                  placeholder="Unlimited if empty"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-chocolate placeholder:text-gray-400 focus:outline-none focus:border-caramel focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-chocolate focus:outline-none focus:border-caramel transition-all"
                />
              </div>
              <div className="flex items-end pb-2.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 accent-caramel cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={editingId ? handleUpdateCoupon : handleCreateCoupon}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-caramel text-chocolate rounded-xl font-medium text-sm hover:bg-caramel/90 transition-all hover:shadow-lg hover:shadow-caramel/25"
              >
                <FiSave size={16} />
                {editingId ? "Update Coupon" : "Create Coupon"}
              </button>
              <button
                onClick={() => { setShowForm(false); setForm(emptyForm); setEditingId(null); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-medium text-sm hover:bg-gray-200 transition-all"
              >
                <FiX size={16} />
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="admin-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-caramel/20 to-amber-100/40 rounded-lg">
                <th className="text-left py-3 px-3 text-chocolate font-semibold rounded-l-lg">Code</th>
                <th className="text-left py-3 px-3 text-chocolate font-semibold">Type</th>
                <th className="text-center py-3 px-3 text-chocolate font-semibold">Value</th>
                <th className="text-right py-3 px-3 text-chocolate font-semibold">Min Order</th>
                <th className="text-center py-3 px-3 text-chocolate font-semibold">Used / Limit</th>
                <th className="text-center py-3 px-3 text-chocolate font-semibold">Expiry</th>
                <th className="text-center py-3 px-3 text-chocolate font-semibold">Status</th>
                <th className="text-center py-3 px-3 text-chocolate font-semibold rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCoupons.map((coupon) => (
                <tr
                  key={coupon.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-chocolate font-mono text-sm">{coupon.code}</span>
                      <button
                        onClick={() => handleCopyCode(coupon.code)}
                        className="p-1 rounded text-gray-400 hover:text-caramel hover:bg-caramel/10 transition-colors"
                        title="Copy code"
                      >
                        <FiCopy size={13} />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadge(coupon.type)}`}>
                      {coupon.type === "PERCENTAGE" ? "%" : coupon.type === "FIXED" ? "₹" : "🚚"} {coupon.type.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-semibold text-chocolate">
                    {coupon.type === "PERCENTAGE" ? `${coupon.value}%` : coupon.type === "FREE_SHIPPING" ? "—" : formatPrice(coupon.value)}
                  </td>
                  <td className="py-3 px-3 text-right text-gray-600">
                    {coupon.minOrder ? formatPrice(coupon.minOrder) : "—"}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-gray-700 font-medium">{coupon.usedCount}</span>
                    <span className="text-gray-400"> / </span>
                    <span className="text-gray-500">{coupon.usageLimit ?? "∞"}</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getExpiryColor(coupon.expiresAt)}`}>
                      <FiCalendar size={11} />
                      {formatDate(coupon.expiresAt)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => handleToggleActive(coupon.id, coupon.code, coupon.isActive)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${
                        coupon.isActive
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {coupon.isActive ? <FiToggleRight size={12} /> : <FiToggleLeft size={12} />}
                      {coupon.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => openEditForm(coupon)}
                        className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <FiEdit size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id, coupon.code)}
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedCoupons.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <FiPercent size={32} className="mx-auto mb-2 opacity-40" />
                    <p>No coupons found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">
            {filteredCoupons.length} coupon{filteredCoupons.length !== 1 && "s"}
          </span>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg text-gray-400 hover:text-chocolate hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                    page === currentPage
                      ? "bg-caramel text-chocolate"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg text-gray-400 hover:text-chocolate hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
