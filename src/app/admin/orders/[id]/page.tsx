"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
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
  product: { id: string; name: string; images: string[] };
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
      if (data.success && data.order) {
        setOrder(data.order);
        setSelectedStatus(data.order.orderStatus);
        setTrackingInput(data.order.trackingNumber || "");
      } else {
        toast.error("Order not found");
        router.push("/admin/orders");
      }
    } catch {
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
          className="p-2 rounded-lg text-gray-400 hover:text-chocolate hover:bg-gray-100 transition-all"
        >
          <FiArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-chocolate">
            Order #{order.orderNumber}
          </h1>
          <p className="text-gray-500 mt-1">View and manage order details</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="admin-card mb-6">
        <div className="flex items-center gap-2 mb-4">
          {isCancelled ? (
            <div className="p-1.5 rounded-lg bg-red-100 text-red-600">
              <FiXCircle size={18} />
            </div>
          ) : (
            <div className="p-1.5 rounded-lg bg-caramel/20 text-caramel">
              <FiTruck size={18} />
            </div>
          )}
          <h3 className="text-lg font-semibold text-chocolate">
            {isCancelled ? "Order Cancelled" : "Order Progress"}
          </h3>
          {isCancelled && (
            <span className="ml-2 inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
              CANCELLED
            </span>
          )}
        </div>

        {isCancelled ? (
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
            <FiAlertCircle className="text-red-500 shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-red-700">This order has been cancelled</p>
              <p className="text-xs text-red-500 mt-0.5">Refund initiated if payment was completed</p>
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
                          ? "bg-caramel text-chocolate shadow-md shadow-caramel/30"
                          : "bg-gray-100 text-gray-400"
                      } ${isCurrent ? "ring-4 ring-caramel/30 scale-110" : ""}`}
                    >
                      {isCompleted ? (
                        <FiCheckCircle size={18} />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium whitespace-nowrap ${
                        isCompleted ? "text-chocolate" : "text-gray-400"
                      }`}
                    >
                      {orderStatusLabels[status]}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-100 hidden md:block">
              <div
                className="h-full bg-caramel transition-all duration-500"
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
                          ? "bg-caramel text-chocolate"
                          : "bg-gray-100 text-gray-400"
                      } ${isCurrent ? "ring-2 ring-caramel/30" : ""}`}
                    >
                      {isCompleted ? <FiCheckCircle size={14} /> : index + 1}
                    </div>
                    <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-caramel transition-all ${
                          isCompleted ? "w-full" : "w-0"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        isCompleted ? "text-chocolate" : "text-gray-400"
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
              <FiShoppingBag className="text-caramel" size={18} />
              <h3 className="text-lg font-semibold text-chocolate">Order Information</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: "Order ID", value: order.orderNumber, icon: FiBox },
                { label: "Date", value: formatDateTime(order.createdAt), icon: FiClock },
                { label: "Payment Method", value: order.paymentMethod, icon: FiCreditCard },
                { label: "Payment Status", value: order.paymentStatus, icon: FiDollarSign },
                { label: "Tracking Number", value: order.trackingNumber || "Not assigned", icon: FiTruck },
                { label: "Last Updated", value: formatDateTime(order.updatedAt), icon: FiRefreshCw },
              ].map((field) => (
                <div key={field.label} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                    <field.icon size={12} />
                    <span>{field.label}</span>
                  </div>
                  <p className="text-sm font-medium text-chocolate">
                    {field.label === "Payment Status" ? (
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.paymentStatus === "COMPLETED" ? "DELIVERED" : order.paymentStatus === "PENDING" ? "PENDING" : "CANCELLED")}`}>
                        {field.value}
                      </span>
                    ) : (
                      field.value
                    )}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="admin-card">
            <div className="flex items-center gap-2 mb-4">
              <FiUser className="text-caramel" size={18} />
              <h3 className="text-lg font-semibold text-chocolate">Customer Details</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Name", value: order.customerName, icon: FiUser },
                { label: "Phone", value: order.customerPhone, icon: FiPhone },
                { label: "Email", value: order.customerEmail, icon: FiMail },
                { label: "Address", value: order.address, icon: FiMapPin },
                { label: "City", value: order.city, icon: FiMapPin },
                { label: "State", value: order.state, icon: FiMapPin },
                { label: "Pincode", value: order.pincode, icon: FiMapPin },
              ].map((field) => (
                <div key={field.label} className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-lg">
                  <field.icon className="text-gray-400 mt-0.5 shrink-0" size={14} />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">{field.label}</p>
                    <p className="text-sm font-medium text-chocolate truncate">{field.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="admin-card">
            <div className="flex items-center gap-2 mb-4">
              <FiPackage className="text-caramel" size={18} />
              <h3 className="text-lg font-semibold text-chocolate">Order Items</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-caramel/20 to-amber-100/40 rounded-lg">
                    <th className="text-left py-3 px-3 text-chocolate font-semibold rounded-l-lg">Product</th>
                    <th className="text-center py-3 px-3 text-chocolate font-semibold">Qty</th>
                    <th className="text-right py-3 px-3 text-chocolate font-semibold">Price</th>
                    <th className="text-right py-3 px-3 text-chocolate font-semibold rounded-r-lg">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-caramel to-amber-300 flex items-center justify-center shrink-0">
                            <FiPackage className="text-chocolate/60" size={15} />
                          </div>
                          <span className="font-medium text-gray-800">{item.product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-gray-600">
                        {formatPrice(item.price)}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-chocolate">
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
              <FiDollarSign className="text-caramel" size={18} />
              <h3 className="text-lg font-semibold text-chocolate">Order Summary</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Subtotal", value: order.subtotal },
                { label: "Discount", value: -order.discount, highlight: order.discount > 0 },
                { label: "Shipping", value: order.shipping },
                { label: "Tax", value: order.tax },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{row.label}</span>
                  <span className={`text-sm font-medium ${row.highlight ? "text-green-600" : "text-chocolate"}`}>
                    {row.value < 0 ? `-${formatPrice(Math.abs(row.value))}` : formatPrice(row.value)}
                  </span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                <span className="text-base font-semibold text-chocolate">Total</span>
                <span className="text-lg font-bold text-chocolate">{formatPrice(order.total)}</span>
              </div>
              {order.couponCode && (
                <div className="flex items-center gap-1.5 p-2.5 bg-green-50 rounded-lg text-xs text-green-700">
                  <FiCheckCircle size={12} />
                  Coupon <strong>{order.couponCode}</strong> applied
                </div>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="admin-card">
            <div className="flex items-center gap-2 mb-4">
              <FiRefreshCw className="text-caramel" size={18} />
              <h3 className="text-lg font-semibold text-chocolate">Update Status</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Order Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-chocolate focus:outline-none focus:border-caramel transition-all"
                >
                  {Object.entries(orderStatusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Tracking Number</label>
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="Enter tracking number..."
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-chocolate placeholder:text-gray-400 focus:outline-none focus:border-caramel transition-all"
                />
              </div>
              <motion.button
                onClick={handleUpdateStatus}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-caramel text-chocolate rounded-xl font-semibold text-sm hover:bg-caramel/90 transition-all hover:shadow-lg hover:shadow-caramel/25"
              >
                <FiRefreshCw size={16} />
                Update Status
              </motion.button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="admin-card">
            <div className="flex items-center gap-2 mb-4">
              <FiSend className="text-caramel" size={18} />
              <h3 className="text-lg font-semibold text-chocolate">Actions</h3>
            </div>
            <div className="space-y-2.5">
              <button
                onClick={() => toast.success("Printing invoice...")}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-gray-100"
              >
                <FiPrinter className="text-gray-400" size={16} />
                Print Invoice
              </button>
              <button
                onClick={() => toast.success("Downloading PDF...")}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-gray-100"
              >
                <FiDownload className="text-gray-400" size={16} />
                Download PDF
              </button>
              <button
                onClick={() => toast.success("Email sent to customer")}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-gray-100"
              >
                <FiMail className="text-gray-400" size={16} />
                Send Email
              </button>
              <button
                onClick={() => toast.success("Contact channel opened")}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-gray-100"
              >
                <FiPhone className="text-gray-400" size={16} />
                Contact Customer
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
