"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiImage,
  FiLink,
  FiToggleLeft,
  FiToggleRight,
  FiEye,
  FiSave,
  FiX,
  FiUpload,
  FiChevronUp,
} from "react-icons/fi";
import toast from "react-hot-toast";

const positions = [
  { value: "hero", label: "Hero" },
  { value: "promo", label: "Promo" },
  { value: "featured", label: "Featured" },
];

const gradientBgs = [
  "from-caramel/80 to-amber-600/80",
  "from-chocolate/80 to-amber-900/80",
  "from-amber-600/80 to-caramel/80",
  "from-chocolate/60 to-caramel/60",
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

function EmptyBannerPreview() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
      <FiImage size={40} className="mb-2" />
      <span className="text-sm font-medium">Banner Preview</span>
      <span className="text-xs mt-1">800 x 300 px</span>
    </div>
  );
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    try {
      const res = await fetch("/api/banners");
      const data = await res.json();
      if (data.success) setBanners(data.banners);
    } catch (e) {
      console.error("Failed to load banners", e);
    } finally {
      setLoading(false);
    }
  }

  const bannerImageUrl = (banner: any) =>
    banner.image || "/images/banner.png";

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bannerImage, setBannerImage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    link: "",
    position: "hero",
    order: 1,
    isActive: true,
  });

  const openAddForm = () => {
    setEditingBanner(null);
    setBannerImage("");
    setFormData({ title: "", subtitle: "", link: "", position: "hero", order: 1, isActive: true });
    setShowForm(true);
  };

  const openEditForm = (banner: any) => {
    setEditingBanner(banner);
    setBannerImage(banner.image || "");
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      link: banner.link,
      position: banner.position,
      order: banner.order,
      isActive: banner.isActive,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Banner title is required");
      return;
    }
    const body = { ...formData, image: bannerImage };
    try {
      if (editingBanner) {
        const res = await fetch(`/api/banners/${editingBanner.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (data.success) {
          setBanners((prev) => prev.map((b) => (b.id === editingBanner.id ? data.banner : b)));
        }
      } else {
        const res = await fetch("/api/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (data.success) {
          setBanners((prev) => [...prev, data.banner]);
        }
      }
      toast.success("Banner saved!");
      setShowForm(false);
      setEditingBanner(null);
    } catch {
      toast.error("Failed to save banner");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/banners/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setBanners((prev) => prev.filter((b) => b.id !== id));
        toast.success(`"${title}" deleted`);
      }
    } catch {
      toast.error("Failed to delete banner");
    }
  };

  const handleToggleActive = async (id: string, title: string, current: boolean) => {
    try {
      const res = await fetch(`/api/banners/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });
      const data = await res.json();
      if (data.success) {
        setBanners((prev) => prev.map((b) => (b.id === id ? data.banner : b)));
        toast.success(`"${title}" ${current ? "disabled" : "enabled"}`);
      }
    } catch {
      toast.error("Failed to toggle banner");
    }
  };

  const handleOrderChange = async (id: string, newOrder: number) => {
    try {
      await fetch(`/api/banners/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: newOrder }),
      });
      setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, order: newOrder } : b)));
    } catch {
      toast.error("Failed to update order");
    }
  };

  const handleImageUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    const uploadToast = toast.loading("Uploading...");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setBannerImage(data.url);
        toast.success("Image uploaded", { id: uploadToast });
      } else {
        toast.error("Upload failed", { id: uploadToast });
      }
    } catch {
      toast.error("Upload failed", { id: uploadToast });
    }
  };

  const sortedBanners = [...banners].sort((a, b) => a.order - b.order);
  const activeBanners = banners.filter((b) => b.isActive).length;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-chocolate">Banner Management</h1>
          <p className="text-gray-500 mt-1">Manage homepage banners and promotional sections</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 rounded-xl font-medium text-sm border border-gray-200 hover:bg-gray-50 transition-all hover:shadow-md"
          >
            <FiEye size={16} />
            Preview
          </button>
          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-caramel text-chocolate rounded-xl font-medium text-sm hover:bg-caramel/90 transition-all hover:shadow-lg hover:shadow-caramel/25"
          >
            <FiPlus size={16} />
            Add New Banner
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Banners", value: banners.length, color: "text-blue-600 bg-blue-50" },
          { label: "Active", value: activeBanners, color: "text-green-600 bg-green-50" },
          { label: "Inactive", value: banners.length - activeBanners, color: "text-gray-600 bg-gray-100" },
          { label: "Positions", value: positions.length, color: "text-amber-600 bg-amber-50" },
        ].map((stat) => (
          <div key={stat.label} className="admin-card flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${stat.color}`}>
              <FiImage size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-chocolate">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      <AnimatePresence>
        {showPreview && (
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="admin-card mb-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-chocolate">Homepage Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-chocolate hover:bg-gray-100 transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>
            <div className="space-y-4">
              {sortedBanners.filter((b) => b.isActive).slice(0, 3).map((banner, idx) => (
                <div
                  key={banner.id}
                  className={`relative w-full rounded-xl overflow-hidden ${
                    idx === 0 ? "h-48 md:h-64" : "h-28 md:h-36"
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${gradientBgs[idx % gradientBgs.length]}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-center">
                    <span className="inline-block text-[10px] uppercase tracking-widest text-caramel/80 font-semibold mb-1">
                      {positions.find((p) => p.value === banner.position)?.label}
                    </span>
                    <h3 className={`font-bold text-white ${idx === 0 ? "text-2xl md:text-3xl" : "text-lg md:text-xl"}`}>
                      {banner.title}
                    </h3>
                    {banner.subtitle && (
                      <p className={`text-white/80 mt-1 ${idx === 0 ? "text-sm md:text-base" : "text-xs"}`}>
                        {banner.subtitle}
                      </p>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-[10px] font-medium rounded-full">
                      Order {banner.order}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="space-y-4">
        {sortedBanners.map((banner, idx) => (
          <motion.div
            key={banner.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="admin-card"
          >
            <div className="flex flex-col md:flex-row gap-5">
              <div className="md:w-64 lg:w-80 flex-shrink-0">
                <div className="relative w-full h-28 md:h-full min-h-[100px] rounded-xl overflow-hidden">
                  <Image
                    src={bannerImageUrl(banner)}
                    alt={banner.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="relative z-10 p-4 h-full flex flex-col justify-end">
                    <h4 className="font-bold text-white text-sm leading-tight">{banner.title}</h4>
                    {banner.subtitle && (
                      <p className="text-white/70 text-xs mt-0.5 line-clamp-1">{banner.subtitle}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-semibold text-chocolate text-base">{banner.title}</h3>
                    <p className="text-gray-500 text-sm mt-0.5">{banner.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleToggleActive(banner.id, banner.title, banner.isActive)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        banner.isActive
                          ? "text-green-500 hover:bg-green-50"
                          : "text-gray-400 hover:bg-gray-100"
                      }`}
                      title={banner.isActive ? "Deactivate" : "Activate"}
                    >
                      {banner.isActive ? <FiToggleRight size={18} /> : <FiToggleLeft size={18} />}
                    </button>
                    <button
                      onClick={() => openEditForm(banner)}
                      className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                      title="Edit"
                    >
                      <FiEdit size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id, banner.title)}
                      className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-gray-400 text-xs">Position</span>
                    <p className="text-chocolate font-medium mt-0.5">
                      {positions.find((p) => p.value === banner.position)?.label}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs">Link URL</span>
                    <p className="text-chocolate font-medium mt-0.5 truncate">
                      {banner.link || <span className="text-gray-300 italic">None</span>}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs">Order</span>
                    <input
                      type="number"
                      value={banner.order}
                      onChange={(e) => handleOrderChange(banner.id, Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 mt-0.5 px-2 py-1 bg-gray-50 border border-gray-200 rounded-md text-sm text-chocolate focus:outline-none focus:border-caramel transition-all"
                      min={1}
                    />
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs">Status</span>
                    <p className="mt-0.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        banner.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {banner.isActive ? "Active" : "Inactive"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-chocolate">
                  {editingBanner ? "Edit Banner" : "Add New Banner"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-chocolate hover:bg-gray-100 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Banner Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter banner title"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-chocolate placeholder:text-gray-400 focus:outline-none focus:border-caramel focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Subtitle</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Enter subtitle"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-chocolate placeholder:text-gray-400 focus:outline-none focus:border-caramel focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Image</label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                  {bannerImage ? (
                    <div className="relative w-full h-36 rounded-xl overflow-hidden border border-gray-200">
                      <Image src={bannerImage} alt="Banner preview" fill className="object-cover" sizes="400px" />
                      <button
                        type="button"
                        onClick={() => setBannerImage("")}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500/80 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-36 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-caramel hover:text-caramel transition-all bg-gray-50"
                    >
                      <FiUpload size={28} className="mb-2" />
                      <span className="text-sm font-medium">Click to upload banner image</span>
                      <span className="text-xs mt-1">Recommended: 1920 x 600 px</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Link URL (optional)</label>
                  <div className="relative">
                    <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      value={formData.link}
                      onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
                      placeholder="/products/category"
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-chocolate placeholder:text-gray-400 focus:outline-none focus:border-caramel focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Position</label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData((prev) => ({ ...prev, position: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-chocolate focus:outline-none focus:border-caramel transition-all"
                    >
                      {positions.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Order</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData((prev) => ({ ...prev, order: Math.max(1, parseInt(e.target.value) || 1) }))}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-chocolate focus:outline-none focus:border-caramel transition-all"
                      min={1}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-gray-700">Active</span>
                  <button
                    onClick={() => setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))}
                    className={`p-1 rounded-lg transition-colors ${
                      formData.isActive ? "text-green-500" : "text-gray-300"
                    }`}
                  >
                    {formData.isActive ? <FiToggleRight size={24} /> : <FiToggleLeft size={24} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-caramel text-chocolate rounded-xl font-medium text-sm hover:bg-caramel/90 transition-all hover:shadow-lg hover:shadow-caramel/25"
                >
                  <FiSave size={16} />
                  Save Banner
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
