"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaArrowLeft, FaArrowRight, FaCheck, FaCreditCard, FaLock, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaMapPin, FaCookieBite, FaHome, FaRupeeSign, FaTimes, FaEdit,
} from "react-icons/fa";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { toast } from "react-hot-toast";

interface FormData {
  fullName: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  upiId: string;
}

interface FormErrors {
  [key: string]: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli",
  "Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh",
  "Lakshadweep", "Puducherry",
];

const paymentMethods = [
  { id: "razorpay", label: "Razorpay", icon: FaCreditCard },
];

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const router = useRouter();
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [formData, setFormData] = useState<FormData>({
    fullName: "", mobile: "", email: "", address: "", city: "", state: "",
    pincode: "", upiId: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const subtotal = getCartTotal();
  const shipping = 0;
  const total = subtotal + shipping;

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.fullName.trim()) errs.fullName = "Full name is required";
    if (!formData.mobile.trim()) errs.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, "")))
      errs.mobile = "Enter a valid 10-digit mobile number";

    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Enter a valid email address";

    if (!formData.address.trim()) errs.address = "Address is required";
    if (!formData.city.trim()) errs.city = "City is required";
    if (!formData.state) errs.state = "Please select a state";
    if (!formData.pincode.trim()) errs.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(formData.pincode))
      errs.pincode = "Enter a valid 6-digit pincode";

    if (!paymentMethod) errs.paymentMethod = "Please select a payment method";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        toast.error(orderData.error || "Failed to initiate payment");
        setLoading(false);
        return;
      }

      const options = {
        key: orderData.key_id || "rzp_live_T5ni2sDYcYohfP",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Zixo Cookies",
        description: "Handcrafted Gourmet Cookies",
        order_id: orderData.id,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.mobile,
        },
        theme: { color: "#D4AF37" },
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              customerInfo: formData,
              items: items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.discountPrice || item.product.price,
              })),
              subtotal,
              discount: 0,
              shipping,
              tax: 0,
              total,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setOrderNumber(verifyData.order.orderNumber);
            clearCart();
            setStep("success");
            toast.success(`Order placed! Order #${verifyData.order.orderNumber}`);
          } else {
            toast.error(verifyData.error || "Payment verification failed");
          }
          setLoading(false);
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.error("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        toast.error(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error("CHECKOUT ERROR:", err);
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (items.length === 0 && step !== "success") {
    return (
      <div className="min-h-screen bg-dark">
        <div className="relative py-16 md:py-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 text-gold/5 text-8xl">🍪</div>
            <div className="absolute bottom-10 right-10 text-gold/5 text-8xl">📦</div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 text-center px-4"
          >
            <h1 className="text-cream font-playfair text-4xl md:text-5xl font-bold mb-3">Checkout</h1>
            <p className="text-cream/70 text-lg">Almost there!</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto px-4 py-20 text-center"
        >
          <div className="text-8xl mb-6 opacity-20 text-gold">🛒</div>
          <h2 className="font-playfair text-2xl font-semibold text-cream mb-2">
            Your cart is empty
          </h2>
          <p className="text-cream/70 mb-8">
            Add some cookies to your cart before checking out.
          </p>
          <Link href="/shop" className="btn-primary inline-flex">
            <FaCookieBite size={16} />
            Start Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 md:p-12 max-w-md w-full text-center border-gold/20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FaCheck size={36} className="text-gold" />
          </motion.div>

          <h2 className="font-playfair text-2xl font-bold text-cream mb-2">
            Order Placed Successfully!
          </h2>
          <p className="text-cream/60 mb-2">Thank you for your order</p>
          <div className="bg-gold/10 border border-gold/30 rounded-xl px-4 py-3 mb-6">
            <p className="text-xs text-cream/50 mb-1">Order Number</p>
            <p className="text-lg font-bold text-gold">{orderNumber}</p>
          </div>
          <p className="text-xs text-cream/40">
            Redirecting you to home page...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <div className="relative py-10 md:py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 text-gold/5 text-8xl">🍪</div>
          <div className="absolute bottom-10 right-10 text-gold/5 text-8xl">📦</div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-cream font-playfair text-4xl md:text-5xl font-bold mb-2">Checkout</h1>
          <p className="text-cream/70">Almost there! Fill in your details to place the order</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-12">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            <div className="flex-1 lg:w-[60%] space-y-6 md:space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4 md:p-6 border-gold/10"
              >
                <h2 className="font-playfair text-lg md:text-xl font-semibold text-cream mb-4 md:mb-6 flex items-center gap-2">
                  <FaUser size={14} className="text-gold" />
                  Shipping Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-cream mb-1.5">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <FaUser size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/30" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        placeholder="Enter your full name"
                        className={`input-field w-full pl-10 ${errors.fullName ? "border-red-400" : ""}`}
                      />
                    </div>
                    {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cream mb-1.5">
                      Mobile Number <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <FaPhone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/30" />
                      <input
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) => handleInputChange("mobile", e.target.value)}
                        placeholder="10-digit mobile number"
                        className={`input-field w-full pl-10 ${errors.mobile ? "border-red-400" : ""}`}
                      />
                    </div>
                    {errors.mobile && <p className="text-xs text-red-400 mt-1">{errors.mobile}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cream mb-1.5">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <FaEnvelope size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/30" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="your@email.com"
                        className={`input-field w-full pl-10 ${errors.email ? "border-red-400" : ""}`}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-cream mb-1.5">
                      Address <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <FaMapMarkerAlt size={14} className="absolute left-3 top-3 text-cream/30" />
                      <textarea
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="Enter your delivery address"
                        rows={3}
                        className={`input-field w-full pl-10 resize-none ${errors.address ? "border-red-400" : ""}`}
                      />
                    </div>
                    {errors.address && <p className="text-xs text-red-400 mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cream mb-1.5">
                      City <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <FaCity size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/30" />
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder="Enter your city"
                        className={`input-field w-full pl-10 ${errors.city ? "border-red-400" : ""}`}
                      />
                    </div>
                    {errors.city && <p className="text-xs text-red-400 mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cream mb-1.5">
                      State <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <FaHome size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/30 z-10" />
                      <select
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        className={`glass w-full pl-10 pr-4 py-2.5 border border-gold/20 rounded-xl text-sm text-cream focus:outline-none focus:border-gold transition-colors appearance-none ${errors.state ? "border-red-400" : ""}`}
                      >
                        <option value="" className="bg-dark text-cream/60">Select a state</option>
                        {indianStates.map((s) => (
                          <option key={s} value={s} className="bg-dark text-cream">{s}</option>
                        ))}
                      </select>
                    </div>
                    {errors.state && <p className="text-xs text-red-400 mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cream mb-1.5">
                      Pincode <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <FaMapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/30" />
                      <input
                        type="text"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange("pincode", e.target.value)}
                        placeholder="6-digit pincode"
                        maxLength={6}
                        className={`input-field w-full pl-10 ${errors.pincode ? "border-red-400" : ""}`}
                      />
                    </div>
                    {errors.pincode && <p className="text-xs text-red-400 mt-1">{errors.pincode}</p>}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-4 md:p-6 border-gold/10"
              >
                <h2 className="font-playfair text-lg md:text-xl font-semibold text-cream mb-4 md:mb-6 flex items-center gap-2">
                  <FaCreditCard size={14} className="text-gold" />
                  Payment Method
                </h2>

                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gold bg-gold/10 text-sm font-medium text-cream">
                  <FaCreditCard size={16} className="text-gold" />
                  Razorpay
                  <FaCheck size={12} className="text-gold ml-auto" />
                </div>


              </motion.div>
            </div>

            <div className="lg:w-[40%]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-4 md:p-6 border-gold/10 lg:sticky lg:top-24"
              >
                <h2 className="font-playfair text-lg md:text-xl font-semibold text-cream mb-4 md:mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3">
                  {items.map((item) => {
                    const price = item.product.discountPrice || item.product.price;
                    return (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <span className="text-cream/80 truncate pr-2">
                          {item.product.name} <span className="text-cream/40">x{item.quantity}</span>
                        </span>
                        <span className="font-medium text-cream whitespace-nowrap">
                          <FaRupeeSign size={11} className="inline" />
                          {formatPrice(price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-gold/10 mt-4 pt-4 space-y-1.5 md:space-y-2 text-xs md:text-sm">
                  <div className="flex justify-between text-cream/70">
                    <span>Subtotal</span>
                    <span className="font-medium text-cream">
                      <FaRupeeSign size={11} className="inline" />
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-cream/70">
                    <span>Shipping</span>
                    <span className="flex items-center gap-1.5">
                      <span className="bg-gold/10 text-gold border border-gold/30 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        FREE
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between text-base md:text-lg font-bold text-gold border-t border-gold/10 pt-2 md:pt-3 mt-2 md:mt-3">
                    <span>Total</span>
                    <span><FaRupeeSign size={13} className="inline" />{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaLock size={14} />
                      Pay with Razorpay - <FaRupeeSign size={13} className="inline" />{formatPrice(total)}
                    </>
                  )}
                </button>

                <p className="text-[10px] text-cream/30 text-center mt-2 md:mt-3 flex items-center justify-center gap-1">
                  <FaLock size={10} />
                  Your information is secure and will not be shared
                </p>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
