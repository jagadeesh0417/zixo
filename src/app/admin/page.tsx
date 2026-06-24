"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  FiShoppingBag,
  FiClock,
  FiCheckCircle,
  FiDollarSign,
  FiUsers,
  FiAlertCircle,
  FiPlus,
  FiList,
  FiDownload,
  FiTrendingUp,
  FiPackage,
  FiEye,
} from "react-icons/fi";
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
} from "recharts";
import toast from "react-hot-toast";
import { formatPrice, getStatusColor, getPaymentStatusColor, formatDate } from "@/lib/utils";

const statsCards = [
  {
    label: "Total Orders",
    value: "156",
    icon: FiShoppingBag,
    color: "bg-blue-500",
    lightColor: "bg-blue-500/10",
    textColor: "text-blue-400",
    change: "+12.5%",
    changeUp: true,
  },
  {
    label: "Pending Orders",
    value: "12",
    icon: FiClock,
    color: "bg-yellow-500",
    lightColor: "bg-yellow-500/10",
    textColor: "text-yellow-400",
    change: "-3.2%",
    changeUp: false,
  },
  {
    label: "Delivered Orders",
    value: "134",
    icon: FiCheckCircle,
    color: "bg-green-500",
    lightColor: "bg-green-500/10",
    textColor: "text-[#D4AF37]",
    change: "+18.7%",
    changeUp: true,
  },
  {
    label: "Total Revenue",
    value: "₹45,890",
    icon: FiDollarSign,
    color: "bg-[#D4AF37]",
    lightColor: "bg-[#D4AF37]/10",
    textColor: "text-[#D4AF37]",
    change: "+22.3%",
    changeUp: true,
  },
  {
    label: "Total Customers",
    value: "89",
    icon: FiUsers,
    color: "bg-purple-500",
    lightColor: "bg-purple-500/10",
    textColor: "text-purple-400",
    change: "+8.1%",
    changeUp: true,
  },
  {
    label: "Low Stock Items",
    value: "3",
    icon: FiAlertCircle,
    color: "bg-red-500",
    lightColor: "bg-red-500/10",
    textColor: "text-red-400",
    change: "+1",
    changeUp: false,
  },
];

const dailySalesData = [
  { day: "Mon", sales: 4200 },
  { day: "Tue", sales: 3800 },
  { day: "Wed", sales: 5100 },
  { day: "Thu", sales: 4600 },
  { day: "Fri", sales: 5900 },
  { day: "Sat", sales: 7200 },
  { day: "Sun", sales: 6800 },
];

const monthlyRevenueData = [
  { month: "Jan", revenue: 28000 },
  { month: "Feb", revenue: 32000 },
  { month: "Mar", revenue: 29000 },
  { month: "Apr", revenue: 35000 },
  { month: "May", revenue: 41000 },
  { month: "Jun", revenue: 45890 },
];

const recentOrders = [
  {
    id: "ZIXO-A2F3-7K9M",
    customer: "Priya Sharma",
    status: "DELIVERED",
    payment: "COMPLETED",
    total: 1250,
    date: "2026-06-22",
  },
  {
    id: "ZIXO-B4D1-3P8Q",
    customer: "Rahul Verma",
    status: "PROCESSING",
    payment: "COMPLETED",
    total: 2340,
    date: "2026-06-22",
  },
  {
    id: "ZIXO-C6E5-2R7S",
    customer: "Ananya Gupta",
    status: "PENDING",
    payment: "PENDING",
    total: 890,
    date: "2026-06-21",
  },
  {
    id: "ZIXO-D8G9-5T1U",
    customer: "Vikram Singh",
    status: "SHIPPED",
    payment: "COMPLETED",
    total: 3120,
    date: "2026-06-21",
  },
  {
    id: "ZIXO-E0H2-8V3W",
    customer: "Neha Patel",
    status: "DELIVERED",
    payment: "COMPLETED",
    total: 1780,
    date: "2026-06-20",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AdminDashboard() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#F8F4EE]">
          Dashboard
        </h1>
        <p className="text-[#F8F4EE]/50 mt-1">
          Welcome back, Admin. Here&apos;s what&apos;s happening today.
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8"
      >
        {statsCards.map((card, index) => (
          <motion.div
            key={card.label}
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="admin-card"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-lg ${card.lightColor}`}>
                <card.icon className={`text-lg ${card.textColor}`} />
              </div>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  card.changeUp
                    ? "bg-green-500/10 text-[#D4AF37]"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {card.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-[#F8F4EE]">{card.value}</p>
            <p className="text-sm text-[#F8F4EE]/50 mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div variants={itemVariants} className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#F8F4EE]">Daily Sales</h3>
            <span className="text-xs text-[#F8F4EE]/40">Last 7 days</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#F8F4EE", fillOpacity: 0.6 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#F8F4EE", fillOpacity: 0.6 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid rgba(212,175,55,0.2)",
                    backgroundColor: "#120A07",
                    color: "#F8F4EE",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, "Sales"]}
                />
                <Bar dataKey="sales" fill="#D4AF37" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#F8F4EE]">Monthly Revenue</h3>
            <span className="text-xs text-[#F8F4EE]/40">Last 6 months</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#F8F4EE", fillOpacity: 0.6 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#F8F4EE", fillOpacity: 0.6 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid rgba(212,175,55,0.2)",
                    backgroundColor: "#120A07",
                    color: "#F8F4EE",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, "Revenue"]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#D4AF37"
                  strokeWidth={3}
                  dot={{ fill: "#D4AF37", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "#D4AF37" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="admin-card mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#F8F4EE]">Recent Orders</h3>
          <Link
            href="/admin/orders"
            className="text-sm text-[#D4AF37] hover:text-[#D4AF37]/80 font-medium transition-colors flex items-center gap-1"
          >
            <FiEye size={14} />
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#D4AF37]/10">
                <th className="text-left py-3 px-2 text-[#F8F4EE]/50 font-medium">Order ID</th>
                <th className="text-left py-3 px-2 text-[#F8F4EE]/50 font-medium">Customer</th>
                <th className="text-left py-3 px-2 text-[#F8F4EE]/50 font-medium">Status</th>
                <th className="text-left py-3 px-2 text-[#F8F4EE]/50 font-medium">Payment</th>
                <th className="text-right py-3 px-2 text-[#F8F4EE]/50 font-medium">Total</th>
                <th className="text-right py-3 px-2 text-[#F8F4EE]/50 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-[#D4AF37]/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-2 font-mono text-xs text-[#F8F4EE]/80">{order.id}</td>
                  <td className="py-3 px-2 text-[#F8F4EE]/80">{order.customer}</td>
                  <td className="py-3 px-2">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment)}`}>
                      {order.payment}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right font-medium text-[#F8F4EE]/80">
                    {formatPrice(order.total)}
                  </td>
                  <td className="py-3 px-2 text-right text-[#F8F4EE]/50">
                    {formatDate(order.date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h3 className="text-lg font-semibold text-[#F8F4EE] mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-5 py-3 bg-[#D4AF37] text-[#0A0503] rounded-xl font-medium text-sm hover:bg-[#D4AF37]/90 transition-all hover:shadow-lg hover:shadow-[#D4AF37]/25"
          >
            <FiPlus size={16} />
            Add New Product
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 px-5 py-3 bg-[#120A07] text-[#F8F4EE]/80 rounded-xl font-medium text-sm border border-[#D4AF37]/20 hover:bg-[#0A0503] transition-all hover:shadow-md"
          >
            <FiList size={16} />
            View All Orders
          </Link>
          <button
            onClick={() => toast.success("Report generation started")}
            className="flex items-center gap-2 px-5 py-3 bg-[#120A07] text-[#F8F4EE]/80 rounded-xl font-medium text-sm border border-[#D4AF37]/20 hover:bg-[#0A0503] transition-all hover:shadow-md"
          >
            <FiDownload size={16} />
            Generate Report
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
