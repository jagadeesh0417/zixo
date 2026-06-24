"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FiArrowLeft,
  FiSave,
  FiCheck,
  FiType,
  FiHash,
  FiDollarSign,
  FiPackage,
  FiList,
  FiImage,
  FiStar,
  FiBox,
} from "react-icons/fi";
import toast from "react-hot-toast";

const categories = ["Chocolate", "Oreo", "Red Velvet", "Butter", "Mixed Boxes"];

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

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    description: "",
    price: "",
    discountPrice: "",
    stockQuantity: "",
    ingredients: "",
    nutritionInfo: "",
    seoTitle: "",
    seoDescription: "",
    isFeatured: false,
    isBestSeller: false,
    isActive: true,
    images: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const generateSku = () => {
    const prefix = "ZIXO";
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const suffix = Date.now().toString(36).substring(0, 4).toUpperCase();
    return `${prefix}-${random}-${suffix}`;
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Product name is required";
    if (!form.category) errs.category = "Category is required";
    if (!form.price || Number(form.price) <= 0) errs.price = "Valid price is required";
    if (form.stockQuantity === "" || Number(form.stockQuantity) < 0) errs.stockQuantity = "Valid stock quantity is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, addAnother = false) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the form errors");
      return;
    }

    setSaving(true);

    setTimeout(() => {
      toast.success(`Product "${form.name}" created successfully`);
      setSaving(false);
      if (addAnother) {
        setForm({
          name: "",
          sku: "",
          category: "",
          description: "",
          price: "",
          discountPrice: "",
          stockQuantity: "",
          ingredients: "",
          nutritionInfo: "",
          seoTitle: "",
          seoDescription: "",
          isFeatured: false,
          isBestSeller: false,
          isActive: true,
          images: [],
        });
        setErrors({});
      } else {
        router.push("/admin/products");
      }
    }, 800);
  };

  const handleAutoSku = () => {
    handleChange("sku", generateSku());
  };

  const inputClass = (field: string) =>
    `w-full px-3.5 py-2.5 bg-[#0A0503] border rounded-lg text-sm text-[#F8F4EE] placeholder:text-[#F8F4EE]/40 focus:outline-none focus:border-[#D4AF37] focus:bg-[#120A07] transition-all ${
      errors[field] ? "border-red-300 bg-red-50" : "border-[#D4AF37]/15"
    }`;

  const labelClass = "block text-sm font-medium text-[#F8F4EE] mb-1.5";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-[#0A0503]"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/products"
          className="p-2 rounded-lg text-[#F8F4EE]/40 hover:text-[#F8F4EE] hover:bg-[#120A07] transition-all"
        >
          <FiArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#F8F4EE]">Add New Product</h1>
          <p className="text-[#F8F4EE]/50 mt-1">Create a new product for your catalog</p>
        </div>
      </motion.div>

      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div variants={itemVariants} className="admin-card bg-[#120A07] border border-[#D4AF37]/10">
              <div className="flex items-center gap-2 mb-4">
                <FiType className="text-[#D4AF37]" size={18} />
                <h3 className="text-lg font-semibold text-[#F8F4EE]">Basic Information</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Product Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="e.g. Classic Chocolate Chip Cookie"
                    className={inputClass("name")}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>SKU</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={form.sku}
                        onChange={(e) => handleChange("sku", e.target.value)}
                        placeholder="Auto-generated"
                        className={inputClass("sku")}
                      />
                      <button
                        type="button"
                        onClick={handleAutoSku}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#D4AF37] hover:text-[#D4AF37]/80 font-medium"
                      >
                        Generate
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Category *</label>
                    <select
                      value={form.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                      className={inputClass("category")}
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea
                    rows={5}
                    value={form.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Describe your product..."
                    className={inputClass("description")}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="admin-card bg-[#120A07] border border-[#D4AF37]/10">
              <div className="flex items-center gap-2 mb-4">
                <FiDollarSign className="text-[#D4AF37]" size={18} />
                <h3 className="text-lg font-semibold text-[#F8F4EE]">Pricing</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Price (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    placeholder="0.00"
                    className={inputClass("price")}
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>
                <div>
                  <label className={labelClass}>Discount Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.discountPrice}
                    onChange={(e) => handleChange("discountPrice", e.target.value)}
                    placeholder="Optional"
                    className={inputClass("discountPrice")}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="admin-card bg-[#120A07] border border-[#D4AF37]/10">
              <div className="flex items-center gap-2 mb-4">
                <FiPackage className="text-[#D4AF37]" size={18} />
                <h3 className="text-lg font-semibold text-[#F8F4EE]">Inventory</h3>
              </div>
              <div>
                <label className={labelClass}>Stock Quantity *</label>
                <input
                  type="number"
                  min="0"
                  value={form.stockQuantity}
                  onChange={(e) => handleChange("stockQuantity", e.target.value)}
                  placeholder="0"
                  className={inputClass("stockQuantity")}
                />
                {errors.stockQuantity && <p className="text-red-500 text-xs mt-1">{errors.stockQuantity}</p>}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="admin-card bg-[#120A07] border border-[#D4AF37]/10">
              <div className="flex items-center gap-2 mb-4">
                <FiList className="text-[#D4AF37]" size={18} />
                <h3 className="text-lg font-semibold text-[#F8F4EE]">Details</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Ingredients</label>
                  <textarea
                    rows={4}
                    value={form.ingredients}
                    onChange={(e) => handleChange("ingredients", e.target.value)}
                    placeholder="List your ingredients..."
                    className={inputClass("ingredients")}
                  />
                </div>
                <div>
                  <label className={labelClass}>Nutrition Information</label>
                  <textarea
                    rows={4}
                    value={form.nutritionInfo}
                    onChange={(e) => handleChange("nutritionInfo", e.target.value)}
                    placeholder="Calories, fat, protein, etc."
                    className={inputClass("nutritionInfo")}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="admin-card bg-[#120A07] border border-[#D4AF37]/10">
              <div className="flex items-center gap-2 mb-4">
                <FiImage className="text-[#D4AF37]" size={18} />
                <h3 className="text-lg font-semibold text-[#F8F4EE]">Images</h3>
              </div>
              <div className="border-2 border-dashed border-[#D4AF37]/30 rounded-xl p-8 text-center hover:border-[#D4AF37] transition-colors">
                <FiImage className="mx-auto text-[#F8F4EE]/30 text-3xl mb-3" />
                <p className="text-sm text-[#F8F4EE]/50 font-medium">Click to upload product images</p>
                <p className="text-xs text-[#F8F4EE]/40 mt-1">PNG, JPG up to 5MB</p>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  id="imageUpload"
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (!files?.length) return;
                    const file = files[0];
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
                        setForm((prev) => ({ ...prev, images: [...prev.images, data.url] }));
                        toast.success("Image uploaded", { id: uploadToast });
                      } else {
                        toast.error("Upload failed", { id: uploadToast });
                      }
                    } catch {
                      toast.error("Upload failed", { id: uploadToast });
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById("imageUpload")?.click()}
                  className="mt-3 px-4 py-2 text-sm text-[#D4AF37] border border-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/5 transition-colors"
                >
                  Choose File
                </button>
              </div>
              {form.images.length > 0 && (
                <div className="flex gap-3 mt-4 flex-wrap">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-lg bg-[#120A07] overflow-hidden group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))}
                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500/80 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="admin-card bg-[#120A07] border border-[#D4AF37]/10">
              <div className="flex items-center gap-2 mb-4">
                <FiHash className="text-[#D4AF37]" size={18} />
                <h3 className="text-lg font-semibold text-[#F8F4EE]">SEO</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>SEO Title</label>
                  <input
                    type="text"
                    value={form.seoTitle}
                    onChange={(e) => handleChange("seoTitle", e.target.value)}
                    placeholder="Meta title for search engines"
                    className={inputClass("seoTitle")}
                  />
                </div>
                <div>
                  <label className={labelClass}>SEO Description</label>
                  <textarea
                    rows={3}
                    value={form.seoDescription}
                    onChange={(e) => handleChange("seoDescription", e.target.value)}
                    placeholder="Meta description for search engines"
                    className={inputClass("seoDescription")}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div variants={itemVariants} className="admin-card bg-[#120A07] border border-[#D4AF37]/10">
              <div className="flex items-center gap-2 mb-4">
                <FiBox className="text-[#D4AF37]" size={18} />
                <h3 className="text-lg font-semibold text-[#F8F4EE]">Options</h3>
              </div>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <FiStar className="text-[#F8F4EE]/40" size={16} />
                    <span className="text-sm text-[#F8F4EE]/80">Featured Product</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => handleChange("isFeatured", e.target.checked)}
                    className="w-5 h-5 rounded border-[#D4AF37]/30 accent-[#D4AF37] cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <FiStar className="text-[#F8F4EE]/40" size={16} />
                    <span className="text-sm text-[#F8F4EE]/80">Best Seller</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.isBestSeller}
                    onChange={(e) => handleChange("isBestSeller", e.target.checked)}
                    className="w-5 h-5 rounded border-[#D4AF37]/30 accent-[#D4AF37] cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <FiBox className="text-[#F8F4EE]/40" size={16} />
                    <span className="text-sm text-[#F8F4EE]/80">Active</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => handleChange("isActive", e.target.checked)}
                    className="w-5 h-5 rounded border-[#D4AF37]/30 accent-[#D4AF37] cursor-pointer"
                  />
                </label>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="sticky top-24 space-y-3">
              <motion.button
                type="submit"
                disabled={saving}
                whileHover={{ scale: saving ? 1 : 1.02 }}
                whileTap={{ scale: saving ? 1 : 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#D4AF37] text-[#0A0503] rounded-xl font-semibold text-sm hover:bg-[#D4AF37]/90 transition-all hover:shadow-lg hover:shadow-[#D4AF37]/25 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave size={16} />
                    Save Product
                  </>
                )}
              </motion.button>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#120A07] text-[#F8F4EE]/80 rounded-xl font-medium text-sm border border-[#D4AF37]/15 hover:bg-[#0A0503] transition-all hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <FiCheck size={16} />
                Save & Add Another
              </button>
            </motion.div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
