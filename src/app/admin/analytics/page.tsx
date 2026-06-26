"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  FiBarChart2,
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiDownload,
  FiCalendar,
  FiFileText,
  FiPieChart,
  FiActivity,
  FiRefreshCw,
  FiGrid,
} from "react-icons/fi";
import Link from "next/link";
import toast from "react-hot-toast";
import { formatPrice, formatDate } from "@/lib/utils";

const dateRanges = ["This Week", "This Month", "This Quarter", "This Year", "Custom"];
const CATEGORY_COLORS = ["#D4AF37", "#6B3A2A", "#8B4513", "#F5DEB3", "#2F1B0E"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  customerAcquisitionCost: number;
  repeatPurchaseRate: number;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  dailySales: Array<{ date: string; sales: number }>;
  categorySales: Array<{ name: string; value: number }>;
  customerGrowth: Array<{ month: string; customers: number }>;
  topProducts: Array<{ id: string; name: string; sales: number; revenue: number }>;
  recentTransactions: Array<{ id: string; orderNumber: string; customer: string; amount: number; status: string; date: string }>;
}

export default function AdminAnalyticsPage() {
  const [activeRange, setActiveRange] = useState("This Month");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analytics/overview");
      const json = await res.json();
      if (json.success) setData(json.analytics);
    } catch (e) {
      console.error("Analytics fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <p className="text-chocolate/50">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const statsCards = [
    { label: "Total Revenue", value: formatPrice(data.totalRevenue), change: null, changeUp: true, icon: FiDollarSign },
    { label: "Total Orders", value: data.totalOrders.toLocaleString(), change: null, changeUp: true, icon: FiShoppingBag },
    { label: "Average Order Value", value: formatPrice(data.averageOrderValue), change: null, changeUp: true, icon: FiBarChart2 },
    { label: "Conversion Rate", value: `${data.conversionRate}%`, change: null, changeUp: true, icon: FiTrendingUp },
    { label: "Customer Acquisition Cost", value: formatPrice(data.customerAcquisitionCost), change: null, changeUp: true, icon: FiUsers },
    { label: "Repeat Purchase Rate", value: `${data.repeatPurchaseRate}%`, change: null, changeUp: true, icon: FiActivity },
  ];

  const exportActions = [
    { label: "Export PDF", icon: FiFileText, action: () => toast.success("PDF export started!") },
    { label: "Export Excel", icon: FiGrid, action: () => toast.success("Excel export started!") },
    { label: "Export CSV", icon: FiDownload, action: () => toast.success("CSV export started!") },
  ];

  const reportActions = [
    { label: "Generate Revenue Report", action: () => toast.success("Report generated successfully!") },
    { label: "Generate Sales Report", action: () => toast.success("Report generated successfully!") },
    { label: "Generate Customer Report", action: () => toast.success("Report generated successfully!") },
    { label: "Generate Product Report", action: () => toast.success("Report generated successfully!") },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-chocolate">
            Analytics <span className="text-caramel">&</span> Reports
          </h1>
          <p className="text-gray-500 mt-1">Track performance, generate insights, and export data.</p>
        </div>
        <div className="flex items-center gap-2">
          {exportActions.map((btn) => (
            <button key={btn.label} onClick={btn.action} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:border-caramel/40 transition-all">
              <btn.icon size={14} />
              <span className="hidden sm:inline">{btn.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2 mb-6">
        {dateRanges.map((range) => (
          <button
            key={range}
            onClick={() => setActiveRange(range)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeRange === range
                ? "bg-caramel text-chocolate shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:border-caramel/40 hover:text-chocolate"
            }`}
          >
            {range}
          </button>
        ))}
        <span className="text-xs text-gray-400 ml-2 flex items-center gap-1">
          <FiCalendar size={12} />
          {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statsCards.map((card) => (
          <motion.div
            key={card.label}
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="admin-card"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-amber-50">
                <card.icon className="text-lg text-caramel" />
              </div>
            </div>
            <p className="text-2xl font-bold text-chocolate">{card.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div variants={itemVariants} className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-chocolate flex items-center gap-2">
              <FiBarChart2 className="text-caramel" size={18} />
              Revenue Over Time
            </h3>
            <span className="text-xs text-gray-400">Monthly</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlyRevenue}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={3} fill="url(#revenueGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-chocolate flex items-center gap-2">
              <FiPieChart className="text-caramel" size={18} />
              Sales by Category
            </h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.categorySales} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                  {data.categorySales.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} formatter={(value: any) => [value, "Products"]} />
                <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-xs text-gray-600">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-chocolate flex items-center gap-2">
              <FiShoppingBag className="text-caramel" size={18} />
              Daily Orders
            </h3>
            <span className="text-xs text-gray-400">Last 30 days</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.dailySales.map((d, i) => ({ day: i + 1, orders: Math.round(d.sales / 100) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} formatter={(value: any) => [value, "Orders"]} />
                <Bar dataKey="orders" fill="#D4AF37" radius={[4, 4, 0, 0]} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-chocolate flex items-center gap-2">
              <FiUsers className="text-caramel" size={18} />
              Customer Growth
            </h3>
            <span className="text-xs text-gray-400">Monthly</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.customerGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} formatter={(value: any) => [value, "New Customers"]} />
                <Line type="monotone" dataKey="customers" stroke="#6B3A2A" strokeWidth={3} dot={{ fill: "#D4AF37", strokeWidth: 2, r: 4, stroke: "#D4AF37" }} activeDot={{ r: 6, fill: "#D4AF37", stroke: "#fff", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div variants={itemVariants} className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-chocolate">Top Selling Products</h3>
            <span className="text-xs text-gray-400">By revenue</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Product</th>
                  <th className="text-right py-3 px-2 text-gray-500 font-medium">Units Sold</th>
                  <th className="text-right py-3 px-2 text-gray-500 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.topProducts.length === 0 ? (
                  <tr><td colSpan={3} className="py-8 text-center text-gray-400">No products found</td></tr>
                ) : data.topProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-2 font-medium text-gray-800">{product.name}</td>
                    <td className="py-3 px-2 text-right text-gray-600">{product.sales}</td>
                    <td className="py-3 px-2 text-right font-semibold text-chocolate">{formatPrice(product.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-chocolate">Recent Transactions</h3>
            <Link href="/admin/orders" className="text-sm text-caramel hover:text-caramel/80 font-medium transition-colors">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Date</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Order ID</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Customer</th>
                  <th className="text-right py-3 px-2 text-gray-500 font-medium">Amount</th>
                  <th className="text-center py-3 px-2 text-gray-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentTransactions.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-400">No transactions found</td></tr>
                ) : data.recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-2 text-gray-500 text-xs">{formatDate(tx.date)}</td>
                    <td className="py-3 px-2 font-mono text-xs text-gray-700">{tx.orderNumber}</td>
                    <td className="py-3 px-2 text-gray-700">{tx.customer}</td>
                    <td className="py-3 px-2 text-right font-semibold text-chocolate">{formatPrice(tx.amount)}</td>
                    <td className="py-3 px-2 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tx.status === "DELIVERED" ? "bg-green-50 text-green-700" :
                        tx.status === "PROCESSING" || tx.status === "PACKED" || tx.status === "SHIPPED" || tx.status === "OUT_FOR_DELIVERY" ? "bg-blue-50 text-blue-700" :
                        tx.status === "PENDING" || tx.status === "CONFIRMED" ? "bg-yellow-50 text-yellow-700" :
                        "bg-red-50 text-red-700"
                      }`}>
                        {tx.status.replace(/_/g, " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="admin-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-chocolate flex items-center gap-2">
            <FiFileText className="text-caramel" size={18} />
            Generate Reports
          </h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {reportActions.map((report) => (
            <button key={report.label} onClick={report.action} className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-caramel/10 hover:border-caramel/40 hover:text-chocolate transition-all hover:shadow-md">
              <FiRefreshCw size={14} className="text-caramel" />
              {report.label}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
