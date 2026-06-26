"use client";

import { useState, useEffect, useCallback } from "react";
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
  FiEye,
  FiTrendingUp,
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

interface DashboardData {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  averageOrderValue: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    paymentStatus: string;
    orderStatus: string;
    createdAt: string;
  }>;
  lowStockItems: number;
  dailySales: Array<{ date: string; sales: number }>;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  pendingOrders: number;
  deliveredOrders: number;
}

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
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, analyticsRes, productsRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/analytics/overview"),
        fetch("/api/products"),
      ]);

      const ordersData = await ordersRes.json();
      const analyticsData = await analyticsRes.json();
      const productsData = await productsRes.json();

      const orders = ordersData.success ? ordersData.orders : [];
      const analytics = analyticsData.success ? analyticsData.analytics : null;
      const products = productsData.success ? productsData.products : [];

      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum: number, o: any) => sum + o.total, 0);
      const pendingOrders = orders.filter((o: any) => o.orderStatus === "PENDING").length;
      const deliveredOrders = orders.filter((o: any) => o.orderStatus === "DELIVERED").length;
      const totalCustomers = analytics?.totalCustomers || 0;
      const lowStockItems = products.filter((p: any) => p.stockQuantity > 0 && p.stockQuantity <= 5).length;

      setData({
        totalOrders,
        totalRevenue,
        totalCustomers,
        totalProducts: analytics?.totalProducts || 0,
        averageOrderValue: analytics?.averageOrderValue || 0,
        recentOrders: orders.slice(0, 5).map((o: any) => ({
          id: o.orderNumber,
          orderNumber: o.orderNumber,
          customerName: o.customerName,
          total: o.total,
          paymentStatus: o.paymentStatus,
          orderStatus: o.orderStatus,
          createdAt: o.createdAt,
        })),
        lowStockItems,
        dailySales: analytics?.dailySales || [],
        monthlyRevenue: analytics?.monthlyRevenue || [],
        pendingOrders,
        deliveredOrders,
      });
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#F8F4EE]/50">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Orders", value: data.totalOrders.toString(), icon: FiShoppingBag, lightColor: "bg-blue-500/10", textColor: "text-blue-400", change: null, changeUp: true },
    { label: "Pending Orders", value: data.pendingOrders.toString(), icon: FiClock, lightColor: "bg-yellow-500/10", textColor: "text-yellow-400", change: null, changeUp: false },
    { label: "Delivered Orders", value: data.deliveredOrders.toString(), icon: FiCheckCircle, lightColor: "bg-green-500/10", textColor: "text-[#D4AF37]", change: null, changeUp: true },
    { label: "Total Revenue", value: formatPrice(data.totalRevenue), icon: FiDollarSign, lightColor: "bg-[#D4AF37]/10", textColor: "text-[#D4AF37]", change: null, changeUp: true },
    { label: "Total Customers", value: data.totalCustomers.toString(), icon: FiUsers, lightColor: "bg-purple-500/10", textColor: "text-purple-400", change: null, changeUp: true },
    { label: "Low Stock Items", value: data.lowStockItems.toString(), icon: FiAlertCircle, lightColor: "bg-red-500/10", textColor: "text-red-400", change: null, changeUp: false },
  ];

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
        {statCards.map((card) => (
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
              <BarChart data={data.dailySales.slice(-7).map((d, i) => ({
                day: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i] || d.date,
                sales: d.sales,
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#F8F4EE", fillOpacity: 0.6 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#F8F4EE", fillOpacity: 0.6 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid rgba(212,175,55,0.2)", backgroundColor: "#120A07", color: "#F8F4EE", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
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
              <LineChart data={data.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#F8F4EE", fillOpacity: 0.6 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#F8F4EE", fillOpacity: 0.6 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid rgba(212,175,55,0.2)", backgroundColor: "#120A07", color: "#F8F4EE", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, "Revenue"]}
                />
                <Line type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={3} dot={{ fill: "#D4AF37", strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: "#D4AF37" }} />
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
              {data.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#F8F4EE]/40">
                    <FiShoppingBag size={32} className="mx-auto mb-2 opacity-40" />
                    <p>No orders found</p>
                  </td>
                </tr>
              ) : data.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-[#D4AF37]/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-2 font-mono text-xs text-[#F8F4EE]/80">{order.orderNumber}</td>
                  <td className="py-3 px-2 text-[#F8F4EE]/80">{order.customerName}</td>
                  <td className="py-3 px-2">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right font-medium text-[#F8F4EE]/80">
                    {formatPrice(order.total)}
                  </td>
                  <td className="py-3 px-2 text-right text-[#F8F4EE]/50">
                    {formatDate(order.createdAt)}
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
