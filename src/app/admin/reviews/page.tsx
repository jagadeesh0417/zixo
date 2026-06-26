"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FiStar,
  FiCheckCircle,
  FiXCircle,
  FiTrash2,
  FiSearch,
  FiMessageSquare,
  FiEye,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { formatDate, getInitials } from "@/lib/utils";

interface Review {
  id: string;
  name: string;
  email: string | null;
  productId: string;
  product: { id: string; name: string } | null;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

const tabs = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending Approval" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar key={star} size={size} className={star <= rating ? "fill-caramel text-caramel" : "text-gray-300"} />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab === "pending") params.set("status", "pending");
      else if (activeTab === "approved") params.set("status", "approved");
      const res = await fetch(`/api/reviews?${params}`);
      const data = await res.json();
      if (data.success) setReviews(data.reviews);
    } catch (e) {
      console.error("Reviews fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const totalReviews = reviews.length;
  const approvedCount = reviews.filter((r) => r.isApproved).length;
  const pendingCount = reviews.filter((r) => !r.isApproved).length;

  const filteredReviews = useMemo(() => {
    if (!search.trim()) return reviews;
    const q = search.toLowerCase();
    return reviews.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.product?.name || "").toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q)
    );
  }, [reviews, search]);

  const someSelected = selectedIds.size > 0;

  const handleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleSelectAll = () => {
    if (filteredReviews.every((r) => selectedIds.has(r.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredReviews.map((r) => r.id)));
    }
  };

  const handleApprove = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: true }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, isApproved: true } : r)));
        toast.success(`Review by ${name} approved`);
      } else toast.error("Failed to approve review");
    } catch { toast.error("Failed to approve review"); }
  };

  const handleReject = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: false }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, isApproved: false } : r)));
        toast.success(`Review by ${name} rejected`);
      } else toast.error("Failed to reject review");
    } catch { toast.error("Failed to reject review"); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete review by ${name}?`)) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
        toast.success(`Review by ${name} deleted`);
      } else toast.error("Failed to delete review");
    } catch { toast.error("Failed to delete review"); }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.size === 0) return;
    let success = 0;
    for (const id of selectedIds) {
      try {
        const res = await fetch(`/api/reviews/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isApproved: true }),
        });
        const data = await res.json();
        if (data.success) success++;
      } catch { /* skip */ }
    }
    if (success > 0) {
      setReviews((prev) => prev.map((r) => selectedIds.has(r.id) ? { ...r, isApproved: true } : r));
      toast.success(`${success} reviews approved`);
      setSelectedIds(new Set());
    }
  };

  const handleBulkReject = async () => {
    if (selectedIds.size === 0) return;
    let success = 0;
    for (const id of selectedIds) {
      try {
        const res = await fetch(`/api/reviews/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isApproved: false }),
        });
        const data = await res.json();
        if (data.success) success++;
      } catch { /* skip */ }
    }
    if (success > 0) {
      setReviews((prev) => prev.map((r) => selectedIds.has(r.id) ? { ...r, isApproved: false } : r));
      toast.success(`${success} reviews rejected`);
      setSelectedIds(new Set());
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-chocolate">Reviews</h1>
        <p className="text-gray-500 mt-1">Manage customer product reviews</p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Reviews", value: totalReviews, icon: FiMessageSquare, color: "text-blue-600 bg-blue-50" },
          { label: "Approved", value: approvedCount, icon: FiCheckCircle, color: "text-green-600 bg-green-50" },
          { label: "Pending Approval", value: pendingCount, icon: FiEye, color: "text-amber-600 bg-amber-50" },
          { label: "Rejected", value: 0, icon: FiXCircle, color: "text-red-600 bg-red-50" },
        ].map((stat) => (
          <div key={stat.label} className="admin-card flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${stat.color}`}><stat.icon size={18} /></div>
            <div>
              <p className="text-2xl font-bold text-chocolate">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="admin-card mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name or product..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-chocolate placeholder:text-gray-400 focus:outline-none focus:border-caramel focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 border-b border-gray-100 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.value
                  ? "border-caramel text-chocolate"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {tab.value === "pending" && pendingCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-amber-100 text-amber-700 rounded-full">{pendingCount}</span>
              )}
            </button>
          ))}
        </div>

        {someSelected && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600 mr-2">{selectedIds.size} selected</span>
            <button onClick={handleBulkApprove} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <FiCheckCircle size={14} /> Approve Selected
            </button>
            <button onClick={handleBulkReject} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
              <FiXCircle size={14} /> Reject Selected
            </button>
          </div>
        )}

        <div className={filteredReviews.length > 0 ? "space-y-3" : ""}>
          {loading ? (
            <div className="py-12 text-center text-gray-400">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-caramel border-t-transparent rounded-full animate-spin" />
                <p>Loading reviews...</p>
              </div>
            </div>
          ) : filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-all hover:shadow-sm"
              >
                <div className="pt-0.5">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(review.id)}
                    onChange={() => handleSelectOne(review.id)}
                    className="w-4 h-4 rounded border-gray-300 accent-caramel cursor-pointer"
                  />
                </div>

                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-caramel/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-caramel">{getInitials(review.name)}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                    <h4 className="font-semibold text-chocolate text-sm">{review.name}</h4>
                    <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-1.5">
                    <StarRating rating={review.rating} />
                    <span className="text-xs text-caramel font-medium">
                      {review.product?.name || "Unknown Product"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>

                  <div className="flex items-center gap-2 mt-3">
                    {!review.isApproved ? (
                      <>
                        <button onClick={() => handleApprove(review.id, review.name)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                          <FiCheckCircle size={13} /> Approve
                        </button>
                        <button onClick={() => handleReject(review.id, review.name)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                          <FiXCircle size={13} /> Reject
                        </button>
                      </>
                    ) : (
                      <button onClick={() => handleReject(review.id, review.name)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                        <FiXCircle size={13} /> Reject
                      </button>
                    )}
                    <button onClick={() => handleDelete(review.id, review.name)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-500 bg-transparent hover:bg-red-50 rounded-lg transition-colors">
                      <FiTrash2 size={13} /> Delete
                    </button>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                    review.isApproved ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                  }`}>
                    {review.isApproved ? "Approved" : "Pending"}
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-400">
              <FiMessageSquare size={36} className="mx-auto mb-2 opacity-40" />
              <p>No reviews found</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
