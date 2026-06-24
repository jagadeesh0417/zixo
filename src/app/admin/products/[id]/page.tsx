"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FiArrowLeft,
  FiSave,
  FiTrash2,
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

const sampleProducts = [
  {
    id: "1", name: "Classic Chocolate Chip", sku: "ZIXO-CC-001", category: "Chocolate",
    description: "Our signature chocolate chip cookies made with premium dark chocolate chunks and a buttery golden base.",
    price: 499, discountPrice: 399, stockQuantity: 45, ingredients: "Flour, Butter, Sugar, Dark Chocolate Chunks (50%), Eggs, Vanilla Extract, Baking Soda, Sea Salt",
    nutritionInfo: "Calories: 220, Fat: 12g, Carbs: 28g, Protein: 3g, Sugar: 18g",
    seoTitle: "Classic Chocolate Chip Cookie | Zixo Cookies",
    seoDescription: "Indulge in our classic chocolate chip cookies - premium dark chocolate chunks in a buttery golden cookie. Order online for fresh delivery.",
    isFeatured: true, isBestSeller: true, isActive: true, images: [],
  },
  {
    id: "2", name: "Double Oreo Delight", sku: "ZIXO-OD-002", category: "Oreo",
    description: "Crushed Oreo pieces folded into a creamy cookie base, topped with white chocolate drizzle.",
    price: 599, discountPrice: null, stockQuantity: 30, ingredients: "Flour, Butter, Sugar, Oreo Crumbles, White Chocolate, Eggs, Vanilla",
    nutritionInfo: "Calories: 280, Fat: 15g, Carbs: 34g, Protein: 4g, Sugar: 22g",
    seoTitle: "Double Oreo Delight Cookie | Zixo Cookies",
    seoDescription: "Double the Oreo, double the delight! Our Oreo cookies are packed with crushed Oreo pieces and white chocolate.",
    isFeatured: false, isBestSeller: true, isActive: true, images: [],
  },
  {
    id: "3", name: "Red Velvet Bliss", sku: "ZIXO-RV-003", category: "Red Velvet",
    description: "Rich red velvet cookie with cream cheese chips and a hint of cocoa.",
    price: 699, discountPrice: 549, stockQuantity: 3, ingredients: "Flour, Butter, Sugar, Cocoa Powder, Cream Cheese Chips, Buttermilk, Red Food Color, Eggs, Vanilla",
    nutritionInfo: "Calories: 260, Fat: 14g, Carbs: 32g, Protein: 3g, Sugar: 20g",
    seoTitle: "Red Velvet Bliss Cookie | Zixo Cookies",
    seoDescription: "Our Red Velvet Bliss cookie - a rich cocoa cookie with cream cheese chips. A customer favorite!",
    isFeatured: true, isBestSeller: false, isActive: true, images: [],
  },
  {
    id: "4", name: "Butter Classic", sku: "ZIXO-BC-004", category: "Butter",
    description: "Simple, elegant butter cookie that melts in your mouth. Made with real European butter.",
    price: 399, discountPrice: null, stockQuantity: 60, ingredients: "European Butter, Flour, Sugar, Egg Yolks, Vanilla Bean, Sea Salt",
    nutritionInfo: "Calories: 180, Fat: 10g, Carbs: 22g, Protein: 2g, Sugar: 12g",
    seoTitle: "Butter Classic Cookie | Zixo Cookies",
    seoDescription: "Simple perfection - our butter classic cookie made with European butter. Light, crispy, and utterly delicious.",
    isFeatured: false, isBestSeller: false, isActive: true, images: [],
  },
  {
    id: "5", name: "Chocolate Fudge Supreme", sku: "ZIXO-CF-005", category: "Chocolate",
    description: "Double chocolate cookie with fudge chunks and a soft, gooey center.",
    price: 799, discountPrice: 649, stockQuantity: 12, ingredients: "Flour, Butter, Dark Cocoa Powder, Brown Sugar, Fudge Chunks, Eggs, Vanilla, Baking Soda",
    nutritionInfo: "Calories: 310, Fat: 17g, Carbs: 38g, Protein: 4g, Sugar: 24g",
    seoTitle: "Chocolate Fudge Supreme | Zixo Cookies",
    seoDescription: "The ultimate chocolate experience - double chocolate cookie with gooey fudge chunks. Order now!",
    isFeatured: true, isBestSeller: true, isActive: true, images: [],
  },
  {
    id: "6", name: "Oreo Cheesecake", sku: "ZIXO-OC-006", category: "Oreo",
    description: "Cheesecake-inspired cookie with Oreo pieces and a creamy cheesecake center.",
    price: 699, discountPrice: null, stockQuantity: 0, ingredients: "Flour, Cream Cheese, Butter, Sugar, Oreo Crumbles, Eggs, Vanilla",
    nutritionInfo: "Calories: 290, Fat: 16g, Carbs: 33g, Protein: 5g, Sugar: 21g",
    seoTitle: "Oreo Cheesecake Cookie | Zixo Cookies",
    seoDescription: "Two desserts in one! Our Oreo Cheesecake cookie combines creamy cheesecake with crunchy Oreo.",
    isFeatured: false, isBestSeller: false, isActive: false, images: [],
  },
  {
    id: "7", name: "Red Velvet Truffle", sku: "ZIXO-RT-007", category: "Red Velvet",
    description: "Decadent red velvet cookie with a white chocolate truffle center.",
    price: 899, discountPrice: 749, stockQuantity: 18, ingredients: "Flour, Butter, Sugar, Cocoa Powder, White Truffle, Buttermilk, Red Color, Eggs",
    nutritionInfo: "Calories: 340, Fat: 19g, Carbs: 40g, Protein: 4g, Sugar: 26g",
    seoTitle: "Red Velvet Truffle Cookie | Zixo Cookies",
    seoDescription: "Luxurious red velvet cookie with a surprise white chocolate truffle center. Pure indulgence!",
    isFeatured: false, isBestSeller: true, isActive: true, images: [],
  },
  {
    id: "8", name: "Butter Pecan Crunch", sku: "ZIXO-BP-008", category: "Butter",
    description: "Buttery cookie loaded with toasted pecans and a caramel drizzle.",
    price: 449, discountPrice: null, stockQuantity: 8, ingredients: "Flour, Butter, Brown Sugar, Toasted Pecans, Caramel, Eggs, Vanilla, Sea Salt",
    nutritionInfo: "Calories: 240, Fat: 14g, Carbs: 28g, Protein: 3g, Sugar: 16g",
    seoTitle: "Butter Pecan Crunch Cookie | Zixo Cookies",
    seoDescription: "Crunchy, buttery, and delicious - our Butter Pecan Crunch cookie with toasted pecans and caramel.",
    isFeatured: false, isBestSeller: false, isActive: true, images: [],
  },
  {
    id: "9", name: "Assorted Gift Box (12 pcs)", sku: "ZIXO-MB-009", category: "Mixed Boxes",
    description: "A curated selection of our best-selling cookies in a beautiful gift box. Perfect for gifting.",
    price: 1499, discountPrice: 1199, stockQuantity: 25, ingredients: "Varied - includes all our cookie varieties",
    nutritionInfo: "Varied per cookie - nutritional information provided inside the box",
    seoTitle: "Assorted Cookie Gift Box | Zixo Cookies",
    seoDescription: "The perfect gift! Our assorted cookie gift box features 12 hand-picked cookies from our best-selling collection.",
    isFeatured: true, isBestSeller: true, isActive: true, images: [],
  },
  {
    id: "10", name: "Chocolate Walnut Brownie", sku: "ZIXO-CW-010", category: "Chocolate",
    description: "Fudgy brownie cookie loaded with chocolate chunks and crunchy walnuts.",
    price: 549, discountPrice: null, stockQuantity: 2, ingredients: "Flour, Butter, Dark Chocolate, Brown Sugar, Walnuts, Eggs, Cocoa Powder, Vanilla",
    nutritionInfo: "Calories: 300, Fat: 18g, Carbs: 34g, Protein: 5g, Sugar: 22g",
    seoTitle: "Chocolate Walnut Brownie Cookie | Zixo Cookies",
    seoDescription: "Brownie meets cookie! Our Chocolate Walnut Brownie is fudgy, crunchy, and absolutely irresistible.",
    isFeatured: false, isBestSeller: false, isActive: true, images: [],
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

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<(typeof sampleProducts)[0] | null>(null);
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

  useEffect(() => {
    const found = sampleProducts.find((p) => p.id === id);
    if (found) {
      setProduct(found);
      setForm({
        name: found.name,
        sku: found.sku,
        category: found.category,
        description: found.description,
        price: String(found.price),
        discountPrice: found.discountPrice ? String(found.discountPrice) : "",
        stockQuantity: String(found.stockQuantity),
        ingredients: found.ingredients || "",
        nutritionInfo: found.nutritionInfo || "",
        seoTitle: found.seoTitle || "",
        seoDescription: found.seoDescription || "",
        isFeatured: found.isFeatured,
        isBestSeller: found.isBestSeller,
        isActive: found.isActive,
        images: found.images || [],
      });
    } else {
      toast.error("Product not found");
      router.push("/admin/products");
    }
  }, [id, router]);

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

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Product name is required";
    if (!form.category) errs.category = "Category is required";
    if (!form.price || Number(form.price) <= 0) errs.price = "Valid price is required";
    if (form.stockQuantity === "" || Number(form.stockQuantity) < 0) errs.stockQuantity = "Valid stock quantity is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the form errors");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          sku: form.sku,
          slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
          category: form.category,
          description: form.description,
          price: parseFloat(form.price),
          discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : null,
          stockQuantity: parseInt(form.stockQuantity) || 0,
          ingredients: form.ingredients,
          nutritionInfo: form.nutritionInfo,
          seoTitle: form.seoTitle,
          seoDescription: form.seoDescription,
          isFeatured: form.isFeatured,
          isBestSeller: form.isBestSeller,
          isActive: form.isActive,
          images: form.images,
        }),
      });

      if (res.ok) {
        toast.success(`Product "${form.name}" updated successfully`);
        setSaving(false);
        router.push("/admin/products");
      } else {
        toast.error("Failed to update product");
        setSaving(false);
      }
    } catch {
      toast.error("Failed to update product");
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${form.name}"? This action cannot be undone.`)) {
      toast.success(`Product "${form.name}" deleted successfully`);
      router.push("/admin/products");
    }
  };

  const inputClass = (field: string) =>
    `w-full px-3.5 py-2.5 bg-[#0A0503] border rounded-lg text-sm text-[#F8F4EE] placeholder:text-[#F8F4EE]/40 focus:outline-none focus:border-[#D4AF37] focus:bg-[#120A07] transition-all ${
      errors[field] ? "border-red-500/50 bg-red-500/10" : "border-[#D4AF37]/15"
    }`;

  const labelClass = "block text-sm font-medium text-[#F8F4EE] mb-1.5";

  if (!product) return null;

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
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-[#F8F4EE]">
            Edit Product: {product.name}
          </h1>
          <p className="text-[#F8F4EE]/50 mt-1">Update product details and information</p>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 bg-red-500/10 rounded-xl font-medium hover:bg-red-500/20 transition-all"
        >
          <FiTrash2 size={16} />
          Delete Product
        </button>
      </motion.div>

      <form onSubmit={handleUpdate}>
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
                    className={inputClass("name")}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>SKU</label>
                    <input
                      type="text"
                      value={form.sku}
                      onChange={(e) => handleChange("sku", e.target.value)}
                      className={inputClass("sku")}
                    />
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
                    className={inputClass("ingredients")}
                  />
                </div>
                <div>
                  <label className={labelClass}>Nutrition Information</label>
                  <textarea
                    rows={4}
                    value={form.nutritionInfo}
                    onChange={(e) => handleChange("nutritionInfo", e.target.value)}
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
                  id="editImageUpload"
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
                  onClick={() => document.getElementById("editImageUpload")?.click()}
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
                    className={inputClass("seoTitle")}
                  />
                </div>
                <div>
                  <label className={labelClass}>SEO Description</label>
                  <textarea
                    rows={3}
                    value={form.seoDescription}
                    onChange={(e) => handleChange("seoDescription", e.target.value)}
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
                    Updating...
                  </>
                ) : (
                  <>
                    <FiSave size={16} />
                    Update Product
                  </>
                )}
              </motion.button>
              <button
                type="button"
                onClick={handleDelete}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 text-red-400 bg-red-500/10 rounded-xl font-medium text-sm border border-red-500/20 hover:bg-red-500/20 transition-all hover:shadow-md"
              >
                <FiTrash2 size={16} />
                Delete Product
              </button>
            </motion.div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
