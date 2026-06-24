"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiShoppingBag,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiTruck,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { formatPrice, formatDate, getStatusColor, getPaymentStatusColor } from "@/lib/utils";

const statusTabs = [
  "All",
  "Pending",
  "Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Out For Delivery",
  "Delivered",
  "Cancelled",
];

const statusMap: Record<string, string> = {
  "Pending": "PENDING",
  "Confirmed": "CONFIRMED",
  "Processing": "PROCESSING",
  "Packed": "PACKED",
  "Shipped": "SHIPPED",
  "Out For Delivery": "OUT_FOR_DELIVERY",
  "Delivered": "DELIVERED",
  "Cancelled": "CANCELLED",
};

const sampleOrders = [
  {
    id: "ord_001",
    orderNumber: "ZIXO-A2F3-7K9M",
    customerName: "Priya Sharma",
    customerPhone: "+91-9876543210",
    items: 3,
    total: 1250,
    paymentStatus: "COMPLETED",
    orderStatus: "DELIVERED",
    paymentMethod: "Razorpay",
    createdAt: "2026-06-22T10:30:00",
  },
  {
    id: "ord_002",
    orderNumber: "ZIXO-B4D1-3P8Q",
    customerName: "Rahul Verma",
    customerPhone: "+91-9876543211",
    items: 5,
    total: 2340,
    paymentStatus: "COMPLETED",
    orderStatus: "PROCESSING",
    paymentMethod: "COD",
    createdAt: "2026-06-22T09:15:00",
  },
  {
    id: "ord_003",
    orderNumber: "ZIXO-C6E5-2R7S",
    customerName: "Ananya Gupta",
    customerPhone: "+91-9876543212",
    items: 2,
    total: 890,
    paymentStatus: "PENDING",
    orderStatus: "PENDING",
    paymentMethod: "Razorpay",
    createdAt: "2026-06-21T18:45:00",
  },
  {
    id: "ord_004",
    orderNumber: "ZIXO-D8G9-5T1U",
    customerName: "Vikram Singh",
    customerPhone: "+91-9876543213",
    items: 4,
    total: 3120,
    paymentStatus: "COMPLETED",
    orderStatus: "SHIPPED",
    paymentMethod: "Razorpay",
    createdAt: "2026-06-21T14:20:00",
  },
  {
    id: "ord_005",
    orderNumber: "ZIXO-E0H2-8V3W",
    customerName: "Neha Patel",
    customerPhone: "+91-9876543214",
    items: 6,
    total: 1780,
    paymentStatus: "COMPLETED",
    orderStatus: "DELIVERED",
    paymentMethod: "COD",
    createdAt: "2026-06-20T11:00:00",
  },
  {
    id: "ord_006",
    orderNumber: "ZIXO-F1I3-9W4X",
    customerName: "Amit Joshi",
    customerPhone: "+91-9876543215",
    items: 1,
    total: 549,
    paymentStatus: "REFUNDED",
    orderStatus: "CANCELLED",
    paymentMethod: "Razorpay",
    createdAt: "2026-06-20T08:30:00",
  },
  {
    id: "ord_007",
    orderNumber: "ZIXO-G2J4-0X5Y",
    customerName: "Sneha Reddy",
    customerPhone: "+91-9876543216",
    items: 3,
    total: 1670,
    paymentStatus: "COMPLETED",
    orderStatus: "OUT_FOR_DELIVERY",
    paymentMethod: "COD",
    createdAt: "2026-06-19T16:10:00",
  },
  {
    id: "ord_008",
    orderNumber: "ZIXO-H3K5-1Y6W",
    customerName: "Rohan Mehta",
    customerPhone: "+91-9876543217",
    items: 2,
    total: 998,
    paymentStatus: "PENDING",
    orderStatus: "CONFIRMED",
    paymentMethod: "Razorpay",
    createdAt: "2026-06-19T13:25:00",
  },
  {
    id: "ord_009",
    orderNumber: "ZIXO-I4L6-2Z7A",
    customerName: "Kavya Nair",
    customerPhone: "+91-9876543218",
    items: 8,
    total: 4250,
    paymentStatus: "FAILED",
    orderStatus: "PENDING",
    paymentMethod: "Razorpay",
    createdAt: "2026-06-18T19:50:00",
  },
  {
    id: "ord_010",
    orderNumber: "ZIXO-J5M7-3A8B",
    customerName: "Arjun Kapoor",
    customerPhone: "+91-9876543219",
    items: 4,
    total: 2150,
    paymentStatus: "COMPLETED",
    orderStatus: "PACKED",
    paymentMethod: "COD",
    createdAt: "2026-06-18T10:05:00",
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

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  const filteredOrders = useMemo(() => {
    let result = [...sampleOrders];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.includes(q)
      );
    }

    if (statusTab !== "All") {
      const mapped = statusMap[statusTab];
      result = result.filter((o) => o.orderStatus === mapped);
    }

    if (dateFrom) {
      const from = new Date(dateFrom);
      result = result.filter((o) => new Date(o.createdAt) >= from);
    }

    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter((o) => new Date(o.createdAt) <= to);
    }

    return result;
  }, [search, statusTab, dateFrom, dateTo]);

  const totalPages = Math.ceil(filteredOrders.length / perPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const stats = useMemo(() => {
    const total = sampleOrders.length;
    const pending = sampleOrders.filter((o) => o.orderStatus === "PENDING").length;
    const processing = sampleOrders.filter(
      (o) => o.orderStatus === "PROCESSING" || o.orderStatus === "CONFIRMED" || o.orderStatus === "PACKED"
    ).length;
    const delivered = sampleOrders.filter((o) => o.orderStatus === "DELIVERED").length;
    const cancelled = sampleOrders.filter((o) => o.orderStatus === "CANCELLED").length;
    return { total, pending, processing, delivered, cancelled };
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-[#0A0503]"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#F8F4EE]">Orders</h1>
          <p className="text-[#F8F4EE]/50 mt-1">Manage and track customer orders</p>
        </div>
        <button
          onClick={() => toast.success("Exporting orders...")}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37] text-[#0A0503] rounded-xl font-medium text-sm hover:bg-[#D4AF37]/90 transition-all hover:shadow-lg hover:shadow-[#D4AF37]/25 self-start"
        >
          <FiDownload size={16} />
          Export
        </button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: "Total", value: stats.total, icon: FiShoppingBag, color: "text-blue-400 bg-blue-500/15" },
          { label: "Pending", value: stats.pending, icon: FiClock, color: "text-yellow-400 bg-yellow-500/15" },
          { label: "Processing", value: stats.processing, icon: FiTruck, color: "text-indigo-400 bg-indigo-500/15" },
          { label: "Delivered", value: stats.delivered, icon: FiCheckCircle, color: "text-green-400 bg-green-500/15" },
          { label: "Cancelled", value: stats.cancelled, icon: FiXCircle, color: "text-red-400 bg-red-500/15" },
        ].map((stat) => (
          <div key={stat.label} className="admin-card flex items-center gap-3 bg-[#120A07] border border-[#D4AF37]/10">
            <div className={`p-2.5 rounded-lg ${stat.color}`}>
              <stat.icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#F8F4EE]">{stat.value}</p>
              <p className="text-xs text-[#F8F4EE]/50">{stat.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="admin-card mb-6 bg-[#120A07] border border-[#D4AF37]/10">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F8F4EE]/40" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search by order ID, customer name, or phone..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#120A07] border border-[#D4AF37]/15 rounded-lg text-sm text-[#F8F4EE] placeholder:text-[#F8F4EE]/40 focus:outline-none focus:border-[#D4AF37] focus:bg-[#120A07] transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#F8F4EE]/50 font-medium">From</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-[#120A07] border border-[#D4AF37]/15 rounded-lg text-sm text-[#F8F4EE] focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#F8F4EE]/50 font-medium">To</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-[#120A07] border border-[#D4AF37]/15 rounded-lg text-sm text-[#F8F4EE] focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-[#D4AF37]/10">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => { setStatusTab(tab); setCurrentPage(1); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusTab === tab
                  ? "bg-[#D4AF37] text-[#0A0503]"
                  : "text-[#F8F4EE]/50 hover:bg-[#120A07]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#D4AF37]/10">
                <th className="text-left py-3 px-3 text-[#F8F4EE] font-semibold rounded-l-lg">Order ID</th>
                <th className="text-left py-3 px-3 text-[#F8F4EE] font-semibold">Customer</th>
                <th className="text-center py-3 px-3 text-[#F8F4EE] font-semibold">Items</th>
                <th className="text-right py-3 px-3 text-[#F8F4EE] font-semibold">Total</th>
                <th className="text-center py-3 px-3 text-[#F8F4EE] font-semibold">Payment</th>
                <th className="text-center py-3 px-3 text-[#F8F4EE] font-semibold">Status</th>
                <th className="text-center py-3 px-3 text-[#F8F4EE] font-semibold">Date</th>
                <th className="text-center py-3 px-3 text-[#F8F4EE] font-semibold rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => window.location.href = `/admin/orders/${order.id}`}
                  className="border-b border-[#D4AF37]/10 hover:bg-[#120A07] transition-colors cursor-pointer"
                >
                  <td className="py-3 px-3">
                    <span className="font-mono text-xs font-medium text-[#F8F4EE]">{order.orderNumber}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[#F8F4EE] font-medium">{order.customerName}</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#120A07] text-xs font-medium text-[#F8F4EE]/60">
                      {order.items}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-[#F8F4EE]">
                    {formatPrice(order.total)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center text-[#F8F4EE]/50 text-xs">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-blue-400 bg-blue-500/15 hover:bg-blue-500/25 transition-colors text-xs font-medium"
                    >
                      <FiEye size={13} />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {paginatedOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#F8F4EE]/40">
                    <FiShoppingBag size={32} className="mx-auto mb-2 opacity-40" />
                    <p>No orders found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-[#D4AF37]/10">
          <span className="text-sm text-[#F8F4EE]/50">
            {filteredOrders.length} order{filteredOrders.length !== 1 && "s"}
          </span>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg text-[#F8F4EE]/40 hover:text-[#F8F4EE] hover:bg-[#120A07] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                    page === currentPage
                      ? "bg-[#D4AF37] text-[#0A0503]"
                      : "text-[#F8F4EE]/50 hover:bg-[#120A07]"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg text-[#F8F4EE]/40 hover:text-[#F8F4EE] hover:bg-[#120A07] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
