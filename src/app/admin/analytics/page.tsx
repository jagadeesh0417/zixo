"use client";

import { useState } from "react";
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
  FiBox,
  FiDownload,
  FiCalendar,
  FiFileText,
  FiPieChart,
  FiActivity,
  FiAlertCircle,
  FiCheckCircle,
  FiRefreshCw,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiPrinter,
  FiGrid,
} from "react-icons/fi";
import Link from "next/link";
import toast from "react-hot-toast";
import { formatPrice, formatDate, formatDateTime } from "@/lib/utils";

const dateRanges = ["This Week", "This Month", "This Quarter", "This Year", "Custom"];

const statsCards = [
  {
    label: "Total Revenue",
    value: "\u20B91,45,890",
    change: "+12.5%",
    changeUp: true,
    icon: FiDollarSign,
  },
  {
    label: "Total Orders",
    value: "1,256",
    change: "+8.3%",
    changeUp: true,
    icon: FiShoppingBag,
  },
  {
    label: "Average Order Value",
    value: "\u20B9349",
    change: "+5.2%",
    changeUp: true,
    icon: FiBarChart2,
  },
  {
    label: "Conversion Rate",
    value: "3.2%",
    change: "+0.4%",
    changeUp: true,
    icon: FiTrendingUp,
  },
  {
    label: "Customer Acquisition Cost",
    value: "\u20B945",
    change: "-2.1%",
    changeUp: true,
    icon: FiUsers,
  },
  {
    label: "Repeat Purchase Rate",
    value: "42%",
    change: "+6.8%",
    changeUp: true,
    icon: FiActivity,
  },
];

const revenueData = [
  { month: "Jan", revenue: 42000 },
  { month: "Feb", revenue: 38000 },
  { month: "Mar", revenue: 51000 },
  { month: "Apr", revenue: 46000 },
  { month: "May", revenue: 59000 },
  { month: "Jun", revenue: 72000 },
  { month: "Jul", revenue: 68000 },
  { month: "Aug", revenue: 75000 },
  { month: "Sep", revenue: 82000 },
  { month: "Oct", revenue: 78000 },
  { month: "Nov", revenue: 91000 },
  { month: "Dec", revenue: 105000 },
];

const categoryData = [
  { name: "Chocolate", value: 35 },
  { name: "Oreo", value: 25 },
  { name: "Red Velvet", value: 18 },
  { name: "Butter", value: 14 },
  { name: "Mixed Boxes", value: 8 },
];

const CATEGORY_COLORS = ["#D4AF37", "#6B3A2A", "#8B4513", "#F5DEB3", "#2F1B0E"];

const dailyOrdersData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  orders: Math.floor(Math.random() * 40) + 10,
}));

const customerGrowthData = [
  { month: "Jan", customers: 45 },
  { month: "Feb", customers: 52 },
  { month: "Mar", customers: 48 },
  { month: "Apr", customers: 65 },
  { month: "May", customers: 58 },
  { month: "Jun", customers: 72 },
  { month: "Jul", customers: 68 },
  { month: "Aug", customers: 85 },
  { month: "Sep", customers: 78 },
  { month: "Oct", customers: 92 },
  { month: "Nov", customers: 88 },
  { month: "Dec", customers: 110 },
];

const topProducts = [
  { name: "Classic Chocolate Chip", unitsSold: 342, revenue: 136458, trend: "up" },
  { name: "Double Oreo Delight", unitsSold: 287, revenue: 143413, trend: "up" },
  { name: "Red Velvet Bliss", unitsSold: 215, revenue: 107535, trend: "up" },
  { name: "Chocolate Fudge Supreme", unitsSold: 198, revenue: 128502, trend: "down" },
  { name: "Assorted Gift Box (12 pcs)", unitsSold: 156, revenue: 186444, trend: "up" },
];

const recentTransactions = [
  { date: "2026-06-23", orderId: "ZIXO-A2F3-7K9M", customer: "Priya Sharma", amount: 1250, status: "Completed" },
  { date: "2026-06-23", orderId: "ZIXO-B4D1-3P8Q", customer: "Rahul Verma", amount: 2340, status: "Processing" },
  { date: "2026-06-22", orderId: "ZIXO-C6E5-2R7S", customer: "Ananya Gupta", amount: 890, status: "Pending" },
  { date: "2026-06-22", orderId: "ZIXO-D8G9-5T1U", customer: "Vikram Singh", amount: 3120, status: "Completed" },
  { date: "2026-06-21", orderId: "ZIXO-E0H2-8V3W", customer: "Neha Patel", amount: 1780, status: "Completed" },
  { date: "2026-06-21", orderId: "ZIXO-F1I3-9W4X", customer: "Amit Joshi", amount: 2150, status: "Refunded" },
  { date: "2026-06-20", orderId: "ZIXO-G2J4-0X5Y", customer: "Sneha Reddy", amount: 3450, status: "Completed" },
  { date: "2026-06-20", orderId: "ZIXO-H3K5-1Y6Z", customer: "Arjun Kapoor", amount: 549, status: "Completed" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const exportActions = [
  { label: "Export PDF", icon: FiFileText, action: () => toast.success("PDF export started!") },
  { label: "Export Excel", icon: FiGrid, action: () => toast.success("Excel export started!") },
  { label: "Export CSV", icon: FiDownload, action: () => toast.success("CSV export started!") },
];

const reportActions = [
  { label: "Generate Revenue Report", action: () => toast.success("Report generated successfully! Download will begin shortly.") },
  { label: "Generate Sales Report", action: () => toast.success("Report generated successfully! Download will begin shortly.") },
  { label: "Generate Customer Report", action: () => toast.success("Report generated successfully! Download will begin shortly.") },
  { label: "Generate Product Report", action: () => toast.success("Report generated successfully! Download will begin shortly.") },
];

export default function AdminAnalyticsPage() {
  const [activeRange, setActiveRange] = useState("This Month");

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
            <button
              key={btn.label}
              onClick={btn.action}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:border-caramel/40 transition-all"
            >
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
          Jun 1 - Jun 23, 2026
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
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                  card.changeUp
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {card.changeUp ? <FiTrendingUp size={10} /> : <FiTrendingDown size={10} />}
                {card.change}
              </span>
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
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `\u20B9${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  formatter={(value: any) => [`\u20B9${Number(value).toLocaleString()}`, "Revenue"]}
                />
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
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  formatter={(value: any) => [`${value}%`, "Share"]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
                />
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
              <BarChart data={dailyOrdersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  formatter={(value: any) => [value, "Orders"]}
                />
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
              <LineChart data={customerGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  formatter={(value: any) => [value, "New Customers"]}
                />
                <Line
                  type="monotone"
                  dataKey="customers"
                  stroke="#6B3A2A"
                  strokeWidth={3}
                  dot={{ fill: "#D4AF37", strokeWidth: 2, r: 4, stroke: "#D4AF37" }}
                  activeDot={{ r: 6, fill: "#D4AF37", stroke: "#fff", strokeWidth: 2 }}
                />
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
                  <th className="text-center py-3 px-2 text-gray-500 font-medium">Trend</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product) => (
                  <tr key={product.name} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-2 font-medium text-gray-800">{product.name}</td>
                    <td className="py-3 px-2 text-right text-gray-600">{product.unitsSold}</td>
                    <td className="py-3 px-2 text-right font-semibold text-chocolate">{formatPrice(product.revenue)}</td>
                    <td className="py-3 px-2 text-center">
                      {product.trend === "up" ? (
                        <FiTrendingUp className="inline text-green-500" size={16} />
                      ) : (
                        <FiTrendingDown className="inline text-red-500" size={16} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-chocolate">Recent Transactions</h3>
            <Link href="/admin/orders" className="text-sm text-caramel hover:text-caramel/80 font-medium transition-colors">
              View All
            </Link>
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
                {recentTransactions.map((tx) => (
                  <tr key={tx.orderId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-2 text-gray-500 text-xs">{formatDate(tx.date)}</td>
                    <td className="py-3 px-2 font-mono text-xs text-gray-700">{tx.orderId}</td>
                    <td className="py-3 px-2 text-gray-700">{tx.customer}</td>
                    <td className="py-3 px-2 text-right font-semibold text-chocolate">{formatPrice(tx.amount)}</td>
                    <td className="py-3 px-2 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tx.status === "Completed" ? "bg-green-50 text-green-700" :
                        tx.status === "Processing" ? "bg-blue-50 text-blue-700" :
                        tx.status === "Pending" ? "bg-yellow-50 text-yellow-700" :
                        "bg-red-50 text-red-700"
                      }`}>
                        {tx.status}
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
            <button
              key={report.label}
              onClick={report.action}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-caramel/10 hover:border-caramel/40 hover:text-chocolate transition-all hover:shadow-md"
            >
              <FiRefreshCw size={14} className="text-caramel" />
              {report.label}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
