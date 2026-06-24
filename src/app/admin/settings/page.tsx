"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiSave,
  FiGlobe,
  FiMail,
  FiPhone,
  FiDollarSign,
  FiMapPin,
  FiShield,
  FiLock,
  FiUser,
  FiImage,
  FiSmartphone,
  FiToggleLeft,
  FiToggleRight,
  FiChevronDown,
  FiChevronUp,
  FiUpload,
} from "react-icons/fi";
import toast from "react-hot-toast";

const sections = [
  { id: "general", label: "General Settings", icon: FiGlobe },
  { id: "social", label: "Social Media", icon: FiUser },
  { id: "shipping", label: "Shipping & Taxes", icon: FiDollarSign },
  { id: "branding", label: "Logo & Branding", icon: FiImage },
  { id: "payment", label: "Payment Settings", icon: FiSmartphone },
  { id: "email", label: "Email Settings", icon: FiMail },
  { id: "security", label: "Security", icon: FiShield },
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

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`p-1 rounded-lg transition-colors ${value ? "text-green-500" : "text-gray-300"}`}
    >
      {value ? <FiToggleRight size={24} /> : <FiToggleLeft size={24} />}
    </button>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  icon: Icon,
  mask = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  icon?: React.ElementType;
  mask?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />}
        <input
          type={mask ? "password" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${Icon ? "pl-9" : "px-4"} pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-chocolate placeholder:text-gray-400 focus:outline-none focus:border-caramel focus:bg-white transition-all`}
        />
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(sections.map((s) => s.id)));

  const [general, setGeneral] = useState({
    storeName: "Zixo Cookies",
    tagline: "Every Bite, Pure Happiness.",
    storeEmail: "hello@zixocookies.com",
    phoneNumber: "+91 80966 97748",
    whatsappNumber: "+91 80966 97748",
  });

  const [social, setSocial] = useState({
    instagram: "https://www.instagram.com/zixo_cookies",
    youtube: "https://youtube.com/@subhani-04",
  });

  const [shipping, setShipping] = useState({
    freeShippingMin: 499,
    standardShipping: 49,
    taxRate: 5,
  });

  const [payment, setPayment] = useState({
    razorpayKeyId: "rzp_live_xxxxxxxxxxxx",
    razorpayKeySecret: "xxxxxxxxxxxxxxxx",
    enableCOD: true,
    enableUPI: true,
    enableCard: true,
  });

  const [email, setEmail] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "hello@zixocookies.com",
    smtpPassword: "********",
    fromEmail: "hello@zixocookies.com",
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
  });

  const [passwordError, setPasswordError] = useState("");

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleUploadPlaceholder = () => {
    toast.success("Logo upload coming soon");
  };

  const handleSave = () => {
    if (security.newPassword || security.confirmPassword) {
      if (security.newPassword.length < 6) {
        setPasswordError("New password must be at least 6 characters");
        return;
      }
      if (security.newPassword !== security.confirmPassword) {
        setPasswordError("Passwords do not match");
        return;
      }
      if (!security.currentPassword) {
        setPasswordError("Current password is required");
        return;
      }
    }
    setPasswordError("");
    toast.success("Settings saved successfully!");
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-chocolate">Website Settings</h1>
        <p className="text-gray-500 mt-1">Configure your store settings and preferences</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        <motion.div variants={itemVariants} className="lg:w-56 flex-shrink-0">
          <div className="admin-card sticky top-24 space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => toggleSection(section.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  expandedSections.has(section.id)
                    ? "bg-caramel/10 text-chocolate"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <section.icon size={16} />
                <span>{section.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <div className="flex-1 space-y-5">
          <motion.div variants={itemVariants} className="admin-card">
            <button
              onClick={() => toggleSection("general")}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <FiGlobe className="text-blue-600" size={18} />
                </div>
                <h3 className="text-lg font-semibold text-chocolate">General Settings</h3>
              </div>
              {expandedSections.has("general") ? <FiChevronUp size={18} className="text-gray-400" /> : <FiChevronDown size={18} className="text-gray-400" />}
            </button>
            {expandedSections.has("general") && (
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Store Name" value={general.storeName} onChange={(v) => setGeneral((p) => ({ ...p, storeName: v }))} icon={FiUser} />
                <InputField label="Tagline" value={general.tagline} onChange={(v) => setGeneral((p) => ({ ...p, tagline: v }))} />
                <InputField label="Store Email" value={general.storeEmail} onChange={(v) => setGeneral((p) => ({ ...p, storeEmail: v }))} icon={FiMail} />
                <InputField label="Phone Number" value={general.phoneNumber} onChange={(v) => setGeneral((p) => ({ ...p, phoneNumber: v }))} icon={FiPhone} />
                <InputField label="WhatsApp Number" value={general.whatsappNumber} onChange={(v) => setGeneral((p) => ({ ...p, whatsappNumber: v }))} icon={FiSmartphone} />
              </div>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="admin-card">
            <button
              onClick={() => toggleSection("social")}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50">
                  <FiUser className="text-purple-600" size={18} />
                </div>
                <h3 className="text-lg font-semibold text-chocolate">Social Media</h3>
              </div>
              {expandedSections.has("social") ? <FiChevronUp size={18} className="text-gray-400" /> : <FiChevronDown size={18} className="text-gray-400" />}
            </button>
            {expandedSections.has("social") && (
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Instagram URL" value={social.instagram} onChange={(v) => setSocial((p) => ({ ...p, instagram: v }))} />
                <InputField label="YouTube URL" value={social.youtube} onChange={(v) => setSocial((p) => ({ ...p, youtube: v }))} />
              </div>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="admin-card">
            <button
              onClick={() => toggleSection("shipping")}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-50">
                  <FiDollarSign className="text-green-600" size={18} />
                </div>
                <h3 className="text-lg font-semibold text-chocolate">Shipping & Taxes</h3>
              </div>
              {expandedSections.has("shipping") ? <FiChevronUp size={18} className="text-gray-400" /> : <FiChevronDown size={18} className="text-gray-400" />}
            </button>
            {expandedSections.has("shipping") && (
              <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Free Shipping Minimum (₹)</label>
                  <input
                    type="number"
                    value={shipping.freeShippingMin}
                    onChange={(e) => setShipping((p) => ({ ...p, freeShippingMin: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-chocolate focus:outline-none focus:border-caramel focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Standard Shipping Charge (₹)</label>
                  <input
                    type="number"
                    value={shipping.standardShipping}
                    onChange={(e) => setShipping((p) => ({ ...p, standardShipping: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-chocolate focus:outline-none focus:border-caramel focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={shipping.taxRate}
                    onChange={(e) => setShipping((p) => ({ ...p, taxRate: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-chocolate focus:outline-none focus:border-caramel focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="admin-card">
            <button
              onClick={() => toggleSection("branding")}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-50">
                  <FiImage className="text-amber-600" size={18} />
                </div>
                <h3 className="text-lg font-semibold text-chocolate">Logo & Branding</h3>
              </div>
              {expandedSections.has("branding") ? <FiChevronUp size={18} className="text-gray-400" /> : <FiChevronDown size={18} className="text-gray-400" />}
            </button>
            {expandedSections.has("branding") && (
              <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                  <div
                    onClick={handleUploadPlaceholder}
                    className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-caramel hover:text-caramel transition-all bg-gray-50"
                  >
                    <FiUpload size={24} className="mb-1" />
                    <span className="text-xs">Upload Logo</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                  <div
                    onClick={handleUploadPlaceholder}
                    className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-caramel hover:text-caramel transition-all bg-gray-50"
                  >
                    <FiUpload size={24} className="mb-1" />
                    <span className="text-xs">Upload Favicon</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Footer Logo</label>
                  <div
                    onClick={handleUploadPlaceholder}
                    className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-caramel hover:text-caramel transition-all bg-gray-50"
                  >
                    <FiUpload size={24} className="mb-1" />
                    <span className="text-xs">Upload Footer Logo</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="admin-card">
            <button
              onClick={() => toggleSection("payment")}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-50">
                  <FiSmartphone className="text-indigo-600" size={18} />
                </div>
                <h3 className="text-lg font-semibold text-chocolate">Payment Settings</h3>
              </div>
              {expandedSections.has("payment") ? <FiChevronUp size={18} className="text-gray-400" /> : <FiChevronDown size={18} className="text-gray-400" />}
            </button>
            {expandedSections.has("payment") && (
              <div className="mt-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Razorpay Key ID" value={payment.razorpayKeyId} onChange={(v) => setPayment((p) => ({ ...p, razorpayKeyId: v }))} mask={true} />
                  <InputField label="Razorpay Key Secret" value={payment.razorpayKeySecret} onChange={(v) => setPayment((p) => ({ ...p, razorpayKeySecret: v }))} mask={true} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Enable COD</span>
                    <Toggle value={payment.enableCOD} onChange={(v) => setPayment((p) => ({ ...p, enableCOD: v }))} />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Enable UPI</span>
                    <Toggle value={payment.enableUPI} onChange={(v) => setPayment((p) => ({ ...p, enableUPI: v }))} />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Enable Card Payments</span>
                    <Toggle value={payment.enableCard} onChange={(v) => setPayment((p) => ({ ...p, enableCard: v }))} />
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="admin-card">
            <button
              onClick={() => toggleSection("email")}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-50">
                  <FiMail className="text-teal-600" size={18} />
                </div>
                <h3 className="text-lg font-semibold text-chocolate">Email Settings</h3>
              </div>
              {expandedSections.has("email") ? <FiChevronUp size={18} className="text-gray-400" /> : <FiChevronDown size={18} className="text-gray-400" />}
            </button>
            {expandedSections.has("email") && (
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="SMTP Host" value={email.smtpHost} onChange={(v) => setEmail((p) => ({ ...p, smtpHost: v }))} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">SMTP Port</label>
                  <input
                    type="number"
                    value={email.smtpPort}
                    onChange={(e) => setEmail((p) => ({ ...p, smtpPort: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-chocolate focus:outline-none focus:border-caramel focus:bg-white transition-all"
                  />
                </div>
                <InputField label="SMTP User" value={email.smtpUser} onChange={(v) => setEmail((p) => ({ ...p, smtpUser: v }))} />
                <InputField label="SMTP Password" value={email.smtpPassword} onChange={(v) => setEmail((p) => ({ ...p, smtpPassword: v }))} mask={true} />
                <InputField label="From Email" value={email.fromEmail} onChange={(v) => setEmail((p) => ({ ...p, fromEmail: v }))} />
              </div>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="admin-card">
            <button
              onClick={() => toggleSection("security")}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-50">
                  <FiShield className="text-red-600" size={18} />
                </div>
                <h3 className="text-lg font-semibold text-chocolate">Security</h3>
              </div>
              {expandedSections.has("security") ? <FiChevronUp size={18} className="text-gray-400" /> : <FiChevronDown size={18} className="text-gray-400" />}
            </button>
            {expandedSections.has("security") && (
              <div className="mt-5 space-y-4">
                <h4 className="text-sm font-semibold text-chocolate">Change Password</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField label="Current Password" value={security.currentPassword} onChange={(v) => setSecurity((p) => ({ ...p, currentPassword: v }))} mask={true} />
                  <InputField label="New Password" value={security.newPassword} onChange={(v) => setSecurity((p) => ({ ...p, newPassword: v }))} mask={true} />
                  <InputField label="Confirm New Password" value={security.confirmPassword} onChange={(v) => setSecurity((p) => ({ ...p, confirmPassword: v }))} mask={true} />
                </div>
                {passwordError && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <FiLock size={13} />
                    {passwordError}
                  </p>
                )}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Two-Factor Authentication</span>
                    <p className="text-xs text-gray-400 mt-0.5">Add an extra layer of security to your account</p>
                  </div>
                  <button
                    onClick={() => toast.success("Two-factor authentication coming soon")}
                    className={`p-1 rounded-lg transition-colors ${security.twoFactorEnabled ? "text-green-500" : "text-gray-300"}`}
                  >
                    {security.twoFactorEnabled ? <FiToggleRight size={24} /> : <FiToggleLeft size={24} />}
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="flex justify-end pt-2">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-6 py-3 bg-caramel text-chocolate rounded-xl font-medium text-sm hover:bg-caramel/90 transition-all hover:shadow-lg hover:shadow-caramel/25"
            >
              <FiSave size={16} />
              Save Settings
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
