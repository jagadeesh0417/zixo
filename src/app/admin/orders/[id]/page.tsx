"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  FiArrowLeft,
  FiShoppingBag,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiDollarSign,
  FiCreditCard,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiPrinter,
  FiDownload,
  FiSend,
  FiRefreshCw,
  FiAlertCircle,
  FiBox,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { formatPrice, formatDateTime, getStatusColor } from "@/lib/utils";

interface OrderItem {
  id: string;
  productId: string;
  product: { id: string; name: string; images: string[]; slug: string };
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentId: string | null;
  orderStatus: string;
  trackingNumber: string | null;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode: string | null;
  notes: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

const orderStatusFlow = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
] as const;

const orderStatusLabels: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out For Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const darkStatusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  CONFIRMED: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  PROCESSING: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  PACKED: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  SHIPPED: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  OUT_FOR_DELIVERY: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  DELIVERED: "bg-green-500/20 text-green-300 border-green-500/30",
  CANCELLED: "bg-red-500/20 text-red-300 border-red-500/30",
  COMPLETED: "bg-green-500/20 text-green-300 border-green-500/30",
  FAILED: "bg-red-500/20 text-red-300 border-red-500/30",
  REFUNDED: "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

const paymentStatusLabels: Record<string, string> = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

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

function NA(value: string | null | undefined): string {
  return value && value.trim() ? value : "Not Available";
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [trackingInput, setTrackingInput] = useState("");

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${params.id}`);
      const data = await res.json();
      console.log("[ADMIN ORDER] Full API response:", data);
      if (data.success && data.order) {
        console.log("[ADMIN ORDER] Order object:", data.order);
        console.log("[ADMIN ORDER] Customer fields:", {
          customerName: data.order.customerName,
          customerEmail: data.order.customerEmail,
          customerPhone: data.order.customerPhone,
          address: data.order.address,
          city: data.order.city,
          state: data.order.state,
          pincode: data.order.pincode,
        });
        console.log("[ADMIN ORDER] Order info:", {
          orderNumber: data.order.orderNumber,
          paymentMethod: data.order.paymentMethod,
          paymentStatus: data.order.paymentStatus,
          trackingNumber: data.order.trackingNumber,
          orderStatus: data.order.orderStatus,
          createdAt: data.order.createdAt,
          updatedAt: data.order.updatedAt,
        });
        setOrder(data.order);
        setSelectedStatus(data.order.orderStatus);
        setTrackingInput(data.order.trackingNumber || "");
      } else {
        toast.error("Order not found");
        router.push("/admin/orders");
      }
    } catch (err) {
      console.error("[ADMIN ORDER] Fetch error:", err);
      toast.error("Failed to load order");
      router.push("/admin/orders");
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleUpdateStatus = async () => {
    if (!order) return;
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderStatus: selectedStatus,
          trackingNumber: trackingInput || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
        toast.success("Order status updated");
      } else {
        toast.error("Failed to update order");
      }
    } catch {
      toast.error("Failed to update order");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#F8F4EE]/50">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[#F8F4EE]/50">Order not found</p>
      </div>
    );
  }

  const currentStepIndex = orderStatusFlow.indexOf(order.orderStatus as typeof orderStatusFlow[number]);
  const isCancelled = order.orderStatus === "CANCELLED";

  const sortedItems = [...order.items].sort((a, b) => a.total - b.total);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/orders"
          className="p-2 rounded-lg text-[#F8F4EE]/50 hover:text-[#D4AF37] hover:bg-white/5 transition-all"
        >
          <FiArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-[#F8F4EE]">
            Order #{order.orderNumber}
          </h1>
          <p className="text-[#F8F4EE]/50 mt-1">View and manage order details</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="admin-card mb-6">
        <div className="flex items-center gap-2 mb-4">
          {isCancelled ? (
            <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400">
              <FiXCircle size={18} />
            </div>
          ) : (
            <div className="p-1.5 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37]">
              <FiTruck size={18} />
            </div>
          )}
          <h3 className="text-lg font-semibold text-[#F8F4EE]">
            {isCancelled ? "Order Cancelled" : "Order Progress"}
          </h3>
          {isCancelled && (
            <span className="ml-2 inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30">
              CANCELLED
            </span>
          )}
        </div>

        {isCancelled ? (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
            <FiAlertCircle className="text-red-400 shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-red-300">This order has been cancelled</p>
              <p className="text-xs text-red-400/70 mt-0.5">Refund initiated if payment was completed</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="hidden md:flex items-center justify-between">
              {orderStatusFlow.map((status, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <div key={status} className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        isCompleted
                          ? "bg-[#D4AF37] text-[#0A0503] shadow-md shadow-[#D4AF37]/30"
                          : "bg-white/5 text-[#F8F4EE]/30"
                      } ${isCurrent ? "ring-4 ring-[#D4AF37]/30 scale-110" : ""}`}
                    >
                      {isCompleted ? (
                        <FiCheckCircle size={18} />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium whitespace-nowrap ${
                        isCompleted ? "text-[#F8F4EE]" : "text-[#F8F4EE]/30"
                      }`}
                    >
                      {orderStatusLabels[status]}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/5 hidden md:block">
              <div
                className="h-full bg-[#D4AF37] transition-all duration-500"
                style={{
                  width: `${(currentStepIndex / (orderStatusFlow.length - 1)) * 100}%`,
                }}
              />
            </div>

            <div className="md:hidden space-y-2">
              {orderStatusFlow.map((status, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <div key={status} className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isCompleted
                          ? "bg-[#D4AF37] text-[#0A0503]"
                          : "bg-white/5 text-[#F8F4EE]/30"
                      } ${isCurrent ? "ring-2 ring-[#D4AF37]/30" : ""}`}
                    >
                      {isCompleted ? <FiCheckCircle size={14} /> : index + 1}
                    </div>
                    <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-[#D4AF37] transition-all ${
                          isCompleted ? "w-full" : "w-0"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        isCompleted ? "text-[#F8F4EE]" : "text-[#F8F4EE]/30"
                      }`}
                    >
                      {orderStatusLabels[status]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={itemVariants} className="admin-card">
            <div className="flex items-center gap-2 mb-4">
              <FiShoppingBag className="text-[#D4AF37]" size={18} />
              <h3 className="text-lg font-semibold text-[#F8F4EE]">Order Information</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: "Order ID", value: order.orderNumber, icon: FiBox },
                { label: "Date", value: formatDateTime(order.createdAt), icon: FiClock },
                { label: "Payment Method", value: order.paymentMethod, icon: FiCreditCard },
                { label: "Payment Status", value: order.paymentStatus, icon: FiDollarSign },
                { label: "Tracking Number", value: NA(order.trackingNumber), icon: FiTruck },
                { label: "Last Updated", value: formatDateTime(order.updatedAt), icon: FiRefreshCw },
              ].map((field) => (
                <div key={field.label} className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-1.5 text-[#F8F4EE]/50 text-xs mb-1">
                    <field.icon size={12} />
                    <span>{field.label}</span>
                  </div>
                  {field.label === "Payment Status" ? (
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${darkStatusColors[order.paymentStatus] || "bg-white/10 text-[#F8F4EE]/70 border-white/10"}`}>
                      {paymentStatusLabels[order.paymentStatus] || order.paymentStatus}
                    </span>
                  ) : (
                    <p className="text-sm font-medium text-[#F8F4EE]">{field.value}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="admin-card">
            <div className="flex items-center gap-2 mb-4">
              <FiUser className="text-[#D4AF37]" size={18} />
              <h3 className="text-lg font-semibold text-[#F8F4EE]">Customer Details</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Name", value: NA(order.customerName), icon: FiUser },
                { label: "Phone", value: NA(order.customerPhone), icon: FiPhone },
                { label: "Email", value: NA(order.customerEmail), icon: FiMail },
                { label: "Address", value: NA(order.address), icon: FiMapPin },
                { label: "City", value: NA(order.city), icon: FiMapPin },
                { label: "State", value: NA(order.state), icon: FiMapPin },
                { label: "Pincode", value: NA(order.pincode), icon: FiMapPin },
              ].map((field) => (
                <div key={field.label} className="flex items-start gap-2.5 p-3 bg-white/5 rounded-xl border border-white/5">
                  <field.icon className="text-[#F8F4EE]/40 mt-0.5 shrink-0" size={14} />
                  <div className="min-w-0">
                    <p className="text-xs text-[#F8F4EE]/50">{field.label}</p>
                    <p className="text-sm font-medium text-[#F8F4EE] break-words">{field.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="admin-card">
            <div className="flex items-center gap-2 mb-4">
              <FiPackage className="text-[#D4AF37]" size={18} />
              <h3 className="text-lg font-semibold text-[#F8F4EE]">Order Items</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/5 rounded-lg">
                    <th className="text-left py-3 px-3 text-[#F8F4EE]/70 font-semibold rounded-l-lg">Product</th>
                    <th className="text-center py-3 px-3 text-[#F8F4EE]/70 font-semibold">Qty</th>
                    <th className="text-right py-3 px-3 text-[#F8F4EE]/70 font-semibold">Price</th>
                    <th className="text-right py-3 px-3 text-[#F8F4EE]/70 font-semibold rounded-r-lg">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedItems.map((item) => (
                    <tr key={item.id} className="border-b border-white/5">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 shrink-0 relative">
                            {item.product.images?.[0] ? (
                              <Image
                                src={item.product.images[0]}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-white/5">
                                <FiPackage className="text-[#F8F4EE]/30" size={16} />
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-[#F8F4EE]">{item.product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/10 text-xs font-medium text-[#F8F4EE]">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-[#F8F4EE]/70">
                        {formatPrice(item.price)}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-[#F8F4EE]">
                        {formatPrice(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div variants={itemVariants} className="admin-card">
            <div className="flex items-center gap-2 mb-4">
              <FiDollarSign className="text-[#D4AF37]" size={18} />
              <h3 className="text-lg font-semibold text-[#F8F4EE]">Order Summary</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Subtotal", value: order.subtotal },
                { label: "Discount", value: -order.discount, highlight: order.discount > 0 },
                { label: "Shipping", value: order.shipping },
                { label: "Tax", value: order.tax },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-sm text-[#F8F4EE]/60">{row.label}</span>
                  <span className={`text-sm font-medium ${row.highlight ? "text-green-400" : "text-[#F8F4EE]"}`}>
                    {row.value < 0 ? `-${formatPrice(Math.abs(row.value))}` : formatPrice(row.value)}
                  </span>
                </div>
              ))}
              <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                <span className="text-base font-semibold text-[#F8F4EE]">Total</span>
                <span className="text-lg font-bold text-[#D4AF37]">{formatPrice(order.total)}</span>
              </div>
              {order.couponCode && (
                <div className="flex items-center gap-1.5 p-2.5 bg-green-500/10 rounded-xl text-xs text-green-300 border border-green-500/20">
                  <FiCheckCircle size={12} />
                  Coupon <strong>{order.couponCode}</strong> applied
                </div>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="admin-card">
            <div className="flex items-center gap-2 mb-4">
              <FiRefreshCw className="text-[#D4AF37]" size={18} />
              <h3 className="text-lg font-semibold text-[#F8F4EE]">Update Status</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#F8F4EE]/60 mb-1.5">Order Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-[#F8F4EE] focus:outline-none focus:border-[#D4AF37] transition-all"
                >
                  {Object.entries(orderStatusLabels).map(([value, label]) => (
                    <option key={value} value={value} className="bg-[#0A0503] text-[#F8F4EE]">{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#F8F4EE]/60 mb-1.5">Tracking Number</label>
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="Enter tracking number..."
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-[#F8F4EE] placeholder:text-[#F8F4EE]/30 focus:outline-none focus:border-[#D4AF37] transition-all"
                />
              </div>
              <motion.button
                onClick={handleUpdateStatus}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#D4AF37] text-[#0A0503] rounded-xl font-semibold text-sm hover:bg-[#D4AF37]/90 transition-all hover:shadow-lg hover:shadow-[#D4AF37]/25"
              >
                <FiRefreshCw size={16} />
                Update Status
              </motion.button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="admin-card">
            <div className="flex items-center gap-2 mb-4">
              <FiSend className="text-[#D4AF37]" size={18} />
              <h3 className="text-lg font-semibold text-[#F8F4EE]">Actions</h3>
            </div>
            <div className="space-y-2.5">
              <button
                onClick={() => toast.success("Printing invoice...")}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#F8F4EE]/70 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/10"
              >
                <FiPrinter className="text-[#F8F4EE]/50" size={16} />
                Print Invoice
              </button>
              <button
                onClick={() => toast.success("Downloading PDF...")}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#F8F4EE]/70 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/10"
              >
                <FiDownload className="text-[#F8F4EE]/50" size={16} />
                Download PDF
              </button>
              <button
                onClick={() => toast.success("Email sent to customer")}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#F8F4EE]/70 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/10"
              >
                <FiMail className="text-[#F8F4EE]/50" size={16} />
                Send Email
              </button>
              <button
                onClick={() => toast.success("Contact channel opened")}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#F8F4EE]/70 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/10"
              >
                <FiPhone className="text-[#F8F4EE]/50" size={16} />
                Contact Customer
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
