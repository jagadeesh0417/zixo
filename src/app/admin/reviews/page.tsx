"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FiStar,
  FiCheckCircle,
  FiXCircle,
  FiTrash2,
  FiSearch,
  FiMessageSquare,
  FiUser,
  FiEye,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { formatDate, getInitials } from "@/lib/utils";

const sampleReviews = [
  {
    id: "1",
    name: "Priya Sharma",
    email: "priya@example.com",
    productId: "1",
    productName: "Classic Chocolate Chip",
    productSlug: "classic-chocolate-chip",
    rating: 5,
    comment: "Absolutely loved the cookies! The chocolate chips are generous and the cookie is perfectly baked. Will definitely order again.",
    isApproved: true,
    createdAt: "2026-06-20T10:30:00",
  },
  {
    id: "2",
    name: "Rahul Verma",
    email: "rahul@example.com",
    productId: "2",
    productName: "Double Oreo Delight",
    productSlug: "double-oreo-delight",
    rating: 4,
    comment: "Great cookies! Very fresh and tasty. The Oreo pieces add a nice crunch. Just wish they were a bit bigger.",
    isApproved: true,
    createdAt: "2026-06-19T14:15:00",
  },
  {
    id: "3",
    name: "Ananya Gupta",
    email: "ananya@example.com",
    productId: "3",
    productName: "Red Velvet Bliss",
    productSlug: "red-velvet-bliss",
    rating: 5,
    comment: "These are the best red velvet cookies I've had outside of a bakery. The cream cheese frosting is divine!",
    isApproved: false,
    createdAt: "2026-06-18T09:45:00",
  },
  {
    id: "4",
    name: "Vikram Singh",
    email: "vikram@example.com",
    productId: "5",
    productName: "Chocolate Fudge Supreme",
    productSlug: "chocolate-fudge-supreme",
    rating: 3,
    comment: "Good cookies but the fudge was a bit too sweet for my taste. Packaging was excellent though.",
    isApproved: true,
    createdAt: "2026-06-17T16:20:00",
  },
  {
    id: "5",
    name: "Neha Patel",
    email: "neha@example.com",
    productId: "1",
    productName: "Classic Chocolate Chip",
    productSlug: "classic-chocolate-chip",
    rating: 5,
    comment: "Ordered these for a party and they were a hit! Everyone asked where I got them from. Highly recommend!",
    isApproved: false,
    createdAt: "2026-06-16T11:00:00",
  },
  {
    id: "6",
    name: "Arjun Reddy",
    email: "arjun@example.com",
    productId: "9",
    productName: "Assorted Gift Box (12 pcs)",
    productSlug: "assorted-gift-box-12-pcs",
    rating: 4,
    comment: "Beautiful presentation and delicious variety. Made for a perfect gift. Would love more savoury options though.",
    isApproved: true,
    createdAt: "2026-06-15T08:30:00",
  },
  {
    id: "7",
    name: "Sneha Kulkarni",
    email: "sneha@example.com",
    productId: "4",
    productName: "Butter Classic",
    productSlug: "butter-classic",
    rating: 2,
    comment: "The cookies were a bit dry and crumbly. Not as good as the last time I ordered. Hope quality improves.",
    isApproved: false,
    createdAt: "2026-06-14T13:10:00",
  },
  {
    id: "8",
    name: "Rohit Deshmukh",
    email: "rohit@example.com",
    productId: "7",
    productName: "Red Velvet Truffle",
    productSlug: "red-velvet-truffle",
    rating: 5,
    comment: "Incredible! These truffle cookies are dangerously addictive. The perfect balance of chocolate and red velvet.",
    isApproved: true,
    createdAt: "2026-06-13T17:45:00",
  },
];

const tabs = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending Approval" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
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
  visible: { opacity: 0, y: 0 },
};

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          size={size}
          className={star <= rating ? "fill-caramel text-caramel" : "text-gray-300"}
        />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState(sampleReviews);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const totalReviews = reviews.length;
  const approvedCount = reviews.filter((r) => r.isApproved).length;
  const pendingCount = reviews.filter((r) => r.isApproved === false).length;
  const rejectedCount = 0;

  const filteredReviews = useMemo(() => {
    let result = [...reviews];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.productName.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q)
      );
    }
    if (activeTab === "approved") result = result.filter((r) => r.isApproved);
    else if (activeTab === "pending") result = result.filter((r) => !r.isApproved);
    else if (activeTab === "rejected") result = [];
    return result;
  }, [reviews, search, activeTab]);

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

  const handleApprove = (id: string, name: string) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, isApproved: true } : r)));
    toast.success(`Review by ${name} approved`);
  };

  const handleReject = (id: string, name: string) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, isApproved: false } : r)));
    toast.success(`Review by ${name} rejected`);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete review by ${name}?`)) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
      setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
      toast.success(`Review by ${name} deleted`);
    }
  };

  const handleBulkApprove = () => {
    if (selectedIds.size === 0) return;
    setReviews((prev) => prev.map((r) => selectedIds.has(r.id) ? { ...r, isApproved: true } : r));
    toast.success(`${selectedIds.size} reviews approved`);
    setSelectedIds(new Set());
  };

  const handleBulkReject = () => {
    if (selectedIds.size === 0) return;
    setReviews((prev) => prev.map((r) => selectedIds.has(r.id) ? { ...r, isApproved: false } : r));
    toast.success(`${selectedIds.size} reviews rejected`);
    setSelectedIds(new Set());
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-chocolate">Reviews</h1>
        <p className="text-gray-500 mt-1">Manage customer product reviews</p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Reviews", value: totalReviews, icon: FiMessageSquare, color: "text-blue-600 bg-blue-50" },
          { label: "Approved", value: approvedCount, icon: FiCheckCircle, color: "text-green-600 bg-green-50" },
          { label: "Pending Approval", value: pendingCount, icon: FiEye, color: "text-amber-600 bg-amber-50" },
          { label: "Rejected", value: rejectedCount, icon: FiXCircle, color: "text-red-600 bg-red-50" },
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
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-amber-100 text-amber-700 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {someSelected && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600 mr-2">{selectedIds.size} selected</span>
            <button
              onClick={handleBulkApprove}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <FiCheckCircle size={14} />
              Approve Selected
            </button>
            <button
              onClick={handleBulkReject}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <FiXCircle size={14} />
              Reject Selected
            </button>
          </div>
        )}

        <div className={filteredReviews.length > 0 ? "space-y-3" : ""}>
          {filteredReviews.length > 0 ? (
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
                  <span className="text-sm font-bold text-caramel">
                    {getInitials(review.name)}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                    <h4 className="font-semibold text-chocolate text-sm">{review.name}</h4>
                    <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-1.5">
                    <StarRating rating={review.rating} />
                    <Link
                      href={`/products/${review.productSlug}`}
                      className="text-xs text-caramel hover:underline font-medium"
                    >
                      {review.productName}
                    </Link>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>

                  <div className="flex items-center gap-2 mt-3">
                    {!review.isApproved ? (
                      <>
                        <button
                          onClick={() => handleApprove(review.id, review.name)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          <FiCheckCircle size={13} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(review.id, review.name)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <FiXCircle size={13} />
                          Reject
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleReject(review.id, review.name)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                      >
                        <FiXCircle size={13} />
                        Reject
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(review.id, review.name)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-500 bg-transparent hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 size={13} />
                      Delete
                    </button>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                    review.isApproved
                      ? "bg-green-50 text-green-700"
                      : "bg-amber-50 text-amber-700"
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
