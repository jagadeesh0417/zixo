"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUsers,
  FiSearch,
  FiDownload,
  FiEye,
  FiTrash2,
  FiUserCheck,
  FiUserX,
  FiMail,
  FiPhone,
  FiDollarSign,
  FiShoppingBag,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { formatPrice, formatDate, getInitials, getStatusColor } from "@/lib/utils";

const sampleCustomers = [
  {
    id: "c1",
    name: "Priya Sharma",
    email: "priya.sharma@gmail.com",
    phone: "+91-98765-43210",
    totalOrders: 12,
    totalSpent: 24850,
    isBlocked: false,
    joinedDate: "2026-01-15",
    orders: [
      { date: "2026-06-20", amount: 1250, status: "DELIVERED" },
      { date: "2026-06-10", amount: 2340, status: "DELIVERED" },
      { date: "2026-05-28", amount: 890, status: "DELIVERED" },
      { date: "2026-05-05", amount: 3120, status: "DELIVERED" },
      { date: "2026-04-18", amount: 1780, status: "DELIVERED" },
    ],
  },
  {
    id: "c2",
    name: "Rahul Verma",
    email: "rahul.verma@yahoo.com",
    phone: "+91-98765-43211",
    totalOrders: 8,
    totalSpent: 15780,
    isBlocked: false,
    joinedDate: "2026-02-03",
    orders: [
      { date: "2026-06-18", amount: 3450, status: "DELIVERED" },
      { date: "2026-06-02", amount: 1670, status: "DELIVERED" },
      { date: "2026-05-15", amount: 549, status: "DELIVERED" },
      { date: "2026-04-22", amount: 2150, status: "DELIVERED" },
      { date: "2026-04-01", amount: 998, status: "CANCELLED" },
    ],
  },
  {
    id: "c3",
    name: "Ananya Gupta",
    email: "ananya.gupta@hotmail.com",
    phone: "+91-98765-43212",
    totalOrders: 5,
    totalSpent: 8920,
    isBlocked: true,
    joinedDate: "2026-02-28",
    orders: [
      { date: "2026-05-10", amount: 1250, status: "DELIVERED" },
      { date: "2026-04-25", amount: 2340, status: "DELIVERED" },
      { date: "2026-04-08", amount: 1780, status: "DELIVERED" },
      { date: "2026-03-20", amount: 890, status: "DELIVERED" },
      { date: "2026-03-01", amount: 2660, status: "CANCELLED" },
    ],
  },
  {
    id: "c4",
    name: "Vikram Singh",
    email: "vikram.singh@gmail.com",
    phone: "+91-98765-43213",
    totalOrders: 15,
    totalSpent: 42150,
    isBlocked: false,
    joinedDate: "2026-01-02",
    orders: [
      { date: "2026-06-22", amount: 4250, status: "PROCESSING" },
      { date: "2026-06-15", amount: 3120, status: "DELIVERED" },
      { date: "2026-06-01", amount: 549, status: "DELIVERED" },
      { date: "2026-05-18", amount: 2340, status: "DELIVERED" },
      { date: "2026-05-02", amount: 6780, status: "DELIVERED" },
    ],
  },
  {
    id: "c5",
    name: "Neha Patel",
    email: "neha.patel@outlook.com",
    phone: "+91-98765-43214",
    totalOrders: 3,
    totalSpent: 4450,
    isBlocked: false,
    joinedDate: "2026-04-12",
    orders: [
      { date: "2026-06-05", amount: 1780, status: "DELIVERED" },
      { date: "2026-05-22", amount: 1250, status: "DELIVERED" },
      { date: "2026-05-08", amount: 1420, status: "DELIVERED" },
    ],
  },
  {
    id: "c6",
    name: "Amit Joshi",
    email: "amit.joshi@gmail.com",
    phone: "+91-98765-43215",
    totalOrders: 7,
    totalSpent: 18350,
    isBlocked: false,
    joinedDate: "2026-03-08",
    orders: [
      { date: "2026-06-12", amount: 2150, status: "DELIVERED" },
      { date: "2026-05-30", amount: 549, status: "DELIVERED" },
      { date: "2026-05-14", amount: 4250, status: "DELIVERED" },
      { date: "2026-04-28", amount: 3120, status: "DELIVERED" },
      { date: "2026-04-10", amount: 1670, status: "DELIVERED" },
    ],
  },
  {
    id: "c7",
    name: "Sneha Reddy",
    email: "sneha.reddy@gmail.com",
    phone: "+91-98765-43216",
    totalOrders: 10,
    totalSpent: 29500,
    isBlocked: false,
    joinedDate: "2026-01-20",
    orders: [
      { date: "2026-06-19", amount: 3450, status: "OUT_FOR_DELIVERY" },
      { date: "2026-06-08", amount: 1670, status: "DELIVERED" },
      { date: "2026-05-25", amount: 4250, status: "DELIVERED" },
      { date: "2026-05-10", amount: 3120, status: "DELIVERED" },
      { date: "2026-04-22", amount: 549, status: "DELIVERED" },
    ],
  },
  {
    id: "c8",
    name: "Arjun Kapoor",
    email: "arjun.kapoor@yahoo.com",
    phone: "+91-98765-43217",
    totalOrders: 6,
    totalSpent: 12750,
    isBlocked: false,
    joinedDate: "2026-03-25",
    orders: [
      { date: "2026-06-14", amount: 2150, status: "DELIVERED" },
      { date: "2026-05-28", amount: 1250, status: "DELIVERED" },
      { date: "2026-05-12", amount: 2340, status: "DELIVERED" },
      { date: "2026-04-20", amount: 890, status: "DELIVERED" },
      { date: "2026-04-02", amount: 1780, status: "CANCELLED" },
    ],
  },
  {
    id: "c9",
    name: "Kavya Nair",
    email: "kavya.nair@gmail.com",
    phone: "+91-98765-43218",
    totalOrders: 4,
    totalSpent: 6890,
    isBlocked: false,
    joinedDate: "2026-04-30",
    orders: [
      { date: "2026-06-10", amount: 1250, status: "DELIVERED" },
      { date: "2026-05-20", amount: 2340, status: "DELIVERED" },
      { date: "2026-05-02", amount: 1780, status: "DELIVERED" },
      { date: "2026-04-15", amount: 1520, status: "DELIVERED" },
    ],
  },
  {
    id: "c10",
    name: "Rohan Mehta",
    email: "rohan.mehta@hotmail.com",
    phone: "+91-98765-43219",
    totalOrders: 2,
    totalSpent: 1796,
    isBlocked: false,
    joinedDate: "2026-05-18",
    orders: [
      { date: "2026-06-16", amount: 998, status: "DELIVERED" },
      { date: "2026-06-01", amount: 798, status: "DELIVERED" },
    ],
  },
];

const avatarColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-cyan-500",
  "bg-rose-500",
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

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState(sampleCustomers);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<typeof sampleCustomers[0] | null>(null);
  const perPage = 5;

  const filteredCustomers = useMemo(() => {
    if (!search.trim()) return customers;
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
    );
  }, [customers, search]);

  const totalPages = Math.ceil(filteredCustomers.length / perPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const stats = useMemo(() => {
    const total = customers.length;
    const active = customers.filter((c) => !c.isBlocked).length;
    const blocked = customers.filter((c) => c.isBlocked).length;
    const revenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    return { total, active, blocked, revenue };
  }, [customers]);

  const handleToggleBlock = (id: string, name: string, blocked: boolean) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isBlocked: !blocked } : c))
    );
    toast.success(`${blocked ? "Unblocked" : "Blocked"} ${name}`);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      if (selectedCustomer?.id === id) setSelectedCustomer(null);
      toast.success(`${name} deleted`);
    }
  };

  const handleViewOrders = (name: string, count: number) => {
    toast.success(`${name} has placed ${count} orders`);
  };

  const getColorForName = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return avatarColors[Math.abs(hash) % avatarColors.length];
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-chocolate">Customers</h1>
          <p className="text-gray-500 mt-1">Manage your customer base</p>
        </div>
        <button
          onClick={() => toast.success("Exporting customers...")}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-caramel text-chocolate rounded-xl font-medium text-sm hover:bg-caramel/90 transition-all hover:shadow-lg hover:shadow-caramel/25 self-start"
        >
          <FiDownload size={16} />
          Export
        </button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Customers", value: stats.total, icon: FiUsers, color: "text-blue-600 bg-blue-50" },
          { label: "Active", value: stats.active, icon: FiUserCheck, color: "text-green-600 bg-green-50" },
          { label: "Blocked", value: stats.blocked, icon: FiUserX, color: "text-red-600 bg-red-50" },
          { label: "Total Revenue", value: formatPrice(stats.revenue), icon: FiDollarSign, color: "text-amber-600 bg-amber-50" },
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
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search by name, email, or phone..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-chocolate placeholder:text-gray-400 focus:outline-none focus:border-caramel focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-caramel/20 to-amber-100/40 rounded-lg">
                <th className="text-left py-3 px-3 text-chocolate font-semibold rounded-l-lg">Customer</th>
                <th className="text-left py-3 px-3 text-chocolate font-semibold">Email</th>
                <th className="text-left py-3 px-3 text-chocolate font-semibold">Phone</th>
                <th className="text-center py-3 px-3 text-chocolate font-semibold">Orders</th>
                <th className="text-right py-3 px-3 text-chocolate font-semibold">Total Spent</th>
                <th className="text-center py-3 px-3 text-chocolate font-semibold">Status</th>
                <th className="text-center py-3 px-3 text-chocolate font-semibold">Joined</th>
                <th className="text-center py-3 px-3 text-chocolate font-semibold rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.map((customer, idx) => (
                <tr
                  key={customer.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full ${getColorForName(customer.name)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                        {getInitials(customer.name)}
                      </div>
                      <span className="font-medium text-gray-800">{customer.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-gray-600 text-xs">{customer.email}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-gray-600 text-xs">{customer.phone}</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                      {customer.totalOrders}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-chocolate">
                    {formatPrice(customer.totalSpent)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.isBlocked
                        ? "bg-red-50 text-red-700"
                        : "bg-green-50 text-green-700"
                    }`}>
                      {customer.isBlocked ? (
                        <><FiUserX size={11} /> Blocked</>
                      ) : (
                        <><FiUserCheck size={11} /> Active</>
                      )}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center text-gray-500 text-xs">
                    {formatDate(customer.joinedDate)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleViewOrders(customer.name, customer.totalOrders); }}
                        className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                        title="View Orders"
                      >
                        <FiShoppingBag size={15} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleBlock(customer.id, customer.name, customer.isBlocked); }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          customer.isBlocked
                            ? "text-green-500 hover:bg-green-50"
                            : "text-orange-500 hover:bg-orange-50"
                        }`}
                        title={customer.isBlocked ? "Unblock" : "Block"}
                      >
                        {customer.isBlocked ? <FiUserCheck size={15} /> : <FiUserX size={15} />}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(customer.id, customer.name); }}
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedCustomers.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <FiUsers size={32} className="mx-auto mb-2 opacity-40" />
                    <p>No customers found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">
            {filteredCustomers.length} customer{filteredCustomers.length !== 1 && "s"}
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

      <AnimatePresence>
        {selectedCustomer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setSelectedCustomer(null)}
            />
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-lg font-bold text-chocolate">Customer Details</h2>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-full ${getColorForName(selectedCustomer.name)} flex items-center justify-center text-white text-lg font-bold shrink-0`}>
                    {getInitials(selectedCustomer.name)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-chocolate">{selectedCustomer.name}</h3>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                      selectedCustomer.isBlocked
                        ? "bg-red-50 text-red-700"
                        : "bg-green-50 text-green-700"
                    }`}>
                      {selectedCustomer.isBlocked ? (
                        <><FiUserX size={11} /> Blocked</>
                      ) : (
                        <><FiUserCheck size={11} /> Active</>
                      )}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FiMail className="text-gray-400 shrink-0" size={16} />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-800">{selectedCustomer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FiPhone className="text-gray-400 shrink-0" size={16} />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-800">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FiCalendar className="text-gray-400 shrink-0" size={16} />
                    <div>
                      <p className="text-xs text-gray-500">Joined</p>
                      <p className="text-sm font-medium text-gray-800">{formatDate(selectedCustomer.joinedDate)}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="admin-card text-center">
                    <FiShoppingBag className="mx-auto mb-1 text-caramel" size={20} />
                    <p className="text-2xl font-bold text-chocolate">{selectedCustomer.totalOrders}</p>
                    <p className="text-xs text-gray-500">Total Orders</p>
                  </div>
                  <div className="admin-card text-center">
                    <FiDollarSign className="mx-auto mb-1 text-caramel" size={20} />
                    <p className="text-2xl font-bold text-chocolate">{formatPrice(selectedCustomer.totalSpent)}</p>
                    <p className="text-xs text-gray-500">Total Spent</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-bold text-chocolate mb-3">Recent Orders</h4>
                  <div className="space-y-2">
                    {selectedCustomer.orders.map((order, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <FiClock className="text-gray-400" size={14} />
                          <span className="text-xs text-gray-600">{formatDate(order.date)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(order.status)}`}>
                            {order.status.replace(/_/g, " ")}
                          </span>
                          <span className="text-sm font-semibold text-chocolate">{formatPrice(order.amount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
