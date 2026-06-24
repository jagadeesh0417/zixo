"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiSearch,
  FiCopy,
  FiPackage,
  FiStar,
  FiBox,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";

const sampleProducts = [
  {
    id: "1",
    name: "Classic Chocolate Chip",
    sku: "ZIXO-CC-001",
    category: "Chocolate",
    price: 499,
    discountPrice: 399,
    stockQuantity: 45,
    isActive: true,
    isFeatured: true,
    isBestSeller: true,
  },
  {
    id: "2",
    name: "Double Oreo Delight",
    sku: "ZIXO-OD-002",
    category: "Oreo",
    price: 599,
    discountPrice: null,
    stockQuantity: 30,
    isActive: true,
    isFeatured: false,
    isBestSeller: true,
  },
  {
    id: "3",
    name: "Red Velvet Bliss",
    sku: "ZIXO-RV-003",
    category: "Red Velvet",
    price: 699,
    discountPrice: 549,
    stockQuantity: 3,
    isActive: true,
    isFeatured: true,
    isBestSeller: false,
  },
  {
    id: "4",
    name: "Butter Classic",
    sku: "ZIXO-BC-004",
    category: "Butter",
    price: 399,
    discountPrice: null,
    stockQuantity: 60,
    isActive: true,
    isFeatured: false,
    isBestSeller: false,
  },
  {
    id: "5",
    name: "Chocolate Fudge Supreme",
    sku: "ZIXO-CF-005",
    category: "Chocolate",
    price: 799,
    discountPrice: 649,
    stockQuantity: 12,
    isActive: true,
    isFeatured: true,
    isBestSeller: true,
  },
  {
    id: "6",
    name: "Oreo Cheesecake",
    sku: "ZIXO-OC-006",
    category: "Oreo",
    price: 699,
    discountPrice: null,
    stockQuantity: 0,
    isActive: false,
    isFeatured: false,
    isBestSeller: false,
  },
  {
    id: "7",
    name: "Red Velvet Truffle",
    sku: "ZIXO-RT-007",
    category: "Red Velvet",
    price: 899,
    discountPrice: 749,
    stockQuantity: 18,
    isActive: true,
    isFeatured: false,
    isBestSeller: true,
  },
  {
    id: "8",
    name: "Butter Pecan Crunch",
    sku: "ZIXO-BP-008",
    category: "Butter",
    price: 449,
    discountPrice: null,
    stockQuantity: 8,
    isActive: true,
    isFeatured: false,
    isBestSeller: false,
  },
  {
    id: "9",
    name: "Assorted Gift Box (12 pcs)",
    sku: "ZIXO-MB-009",
    category: "Mixed Boxes",
    price: 1499,
    discountPrice: 1199,
    stockQuantity: 25,
    isActive: true,
    isFeatured: true,
    isBestSeller: true,
  },
  {
    id: "10",
    name: "Chocolate Walnut Brownie",
    sku: "ZIXO-CW-010",
    category: "Chocolate",
    price: 549,
    discountPrice: null,
    stockQuantity: 2,
    isActive: true,
    isFeatured: false,
    isBestSeller: false,
  },
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

const categories = ["All", "Chocolate", "Oreo", "Red Velvet", "Butter", "Mixed Boxes"];

export default function AdminProductsPage() {
  const [products, setProducts] = useState(sampleProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== "All") {
      result = result.filter((p) => p.category === categoryFilter);
    }

    if (statusFilter !== "All") {
      const active = statusFilter === "Active";
      result = result.filter((p) => p.isActive === active);
    }

    if (stockFilter !== "All") {
      if (stockFilter === "Low") result = result.filter((p) => p.stockQuantity < 5);
      else if (stockFilter === "Medium") result = result.filter((p) => p.stockQuantity >= 5 && p.stockQuantity <= 20);
      else if (stockFilter === "High") result = result.filter((p) => p.stockQuantity > 20);
    }

    return result;
  }, [products, search, categoryFilter, statusFilter, stockFilter]);

  const totalPages = Math.ceil(filteredProducts.length / perPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const lowStockItems = products.filter((p) => p.stockQuantity < 5).length;
  const featuredItems = products.filter((p) => p.isFeatured).length;

  const allSelected = paginatedProducts.length > 0 && paginatedProducts.every((p) => selectedIds.has(p.id));
  const someSelected = paginatedProducts.some((p) => selectedIds.has(p.id));

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedProducts.map((p) => p.id)));
    }
  };

  const handleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
      toast.success(`"${name}" deleted successfully`);
    }
  };

  const handleDuplicate = (product: typeof sampleProducts[0]) => {
    toast.success(`"${product.name}" duplicated`);
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`Delete ${selectedIds.size} selected products?`)) {
      setProducts((prev) => prev.filter((p) => !selectedIds.has(p.id)));
      toast.success(`${selectedIds.size} products deleted`);
      setSelectedIds(new Set());
    }
  };

  const handleToggleStatus = (id: string, name: string, current: boolean) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !current } : p))
    );
    toast.success(`"${name}" ${current ? "disabled" : "enabled"}`);
  };

  const getStockColor = (qty: number) => {
    if (qty > 20) return "text-green-600 bg-green-50";
    if (qty >= 5) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-[#0A0503]"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#F8F4EE]">Products</h1>
          <p className="text-[#F8F4EE]/50 mt-1">Manage your cookie product catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37] text-[#0A0503] rounded-xl font-medium text-sm hover:bg-[#D4AF37]/90 transition-all hover:shadow-lg hover:shadow-[#D4AF37]/25 self-start"
        >
          <FiPlus size={16} />
          Add New Product
        </Link>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Products", value: totalProducts, icon: FiPackage, color: "text-blue-600 bg-blue-50" },
          { label: "Active", value: activeProducts, icon: FiBox, color: "text-green-600 bg-green-50" },
          { label: "Low Stock", value: lowStockItems, icon: FiStar, color: "text-red-600 bg-red-50" },
          { label: "Featured", value: featuredItems, icon: FiStar, color: "text-amber-600 bg-amber-50" },
        ].map((stat) => (
          <div key={stat.label} className="admin-card flex items-center gap-3 bg-[#120A07] border border-[#D4AF37]/10">
            <div className={`p-2.5 rounded-lg ${stat.color}`}>
              <stat.icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#F8F4EE]">{stat.value}</p>
              <p className="text-xs text-[#F8F4EE]/50">{stat.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="admin-card mb-6 bg-[#120A07] border border-[#D4AF37]/10">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F8F4EE]/40" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search products by name or SKU..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#0A0503] border border-[#D4AF37]/20 rounded-lg text-sm text-[#F8F4EE] placeholder:text-[#F8F4EE]/40 focus:outline-none focus:border-[#D4AF37] focus:bg-[#120A07] transition-all"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2.5 bg-[#0A0503] border border-[#D4AF37]/20 rounded-lg text-sm text-[#F8F4EE] focus:outline-none focus:border-[#D4AF37] transition-all"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat === "All" ? "All Categories" : cat}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2.5 bg-[#0A0503] border border-[#D4AF37]/20 rounded-lg text-sm text-[#F8F4EE] focus:outline-none focus:border-[#D4AF37] transition-all"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Disabled">Disabled</option>
          </select>
          <select
            value={stockFilter}
            onChange={(e) => { setStockFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2.5 bg-[#0A0503] border border-[#D4AF37]/20 rounded-lg text-sm text-[#F8F4EE] focus:outline-none focus:border-[#D4AF37] transition-all"
          >
            <option value="All">All Stock</option>
            <option value="Low">Low (&lt;5)</option>
            <option value="Medium">Medium (5-20)</option>
            <option value="High">High (&gt;20)</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#D4AF37]/10">
                <th className="py-3 pr-2 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-[#D4AF37]/30 accent-[#D4AF37] cursor-pointer"
                  />
                </th>
                <th className="text-left py-3 px-2 text-[#F8F4EE] font-semibold">Image</th>
                <th className="text-left py-3 px-2 text-[#F8F4EE] font-semibold">Product Name</th>
                <th className="text-left py-3 px-2 text-[#F8F4EE] font-semibold">SKU</th>
                <th className="text-left py-3 px-2 text-[#F8F4EE] font-semibold">Category</th>
                <th className="text-left py-3 px-2 text-[#F8F4EE] font-semibold">Price</th>
                <th className="text-left py-3 px-2 text-[#F8F4EE] font-semibold">Stock</th>
                <th className="text-left py-3 px-2 text-[#F8F4EE] font-semibold">Status</th>
                <th className="text-left py-3 px-2 text-[#F8F4EE] font-semibold">Badges</th>
                <th className="text-right py-3 px-2 text-[#F8F4EE] font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => {
                const discountPct = product.discountPrice
                  ? getDiscountPercentage(product.price, product.discountPrice)
                  : null;
                return (
                  <tr
                    key={product.id}
                    className="border-b border-[#D4AF37]/10 hover:bg-[#120A07] transition-colors"
                  >
                    <td className="py-3 pr-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(product.id)}
                        onChange={() => handleSelectOne(product.id)}
                        className="w-4 h-4 rounded border-[#D4AF37]/30 accent-[#D4AF37] cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#D4AF37]/20">
                        {(product as any).images?.[0] ? (
                          <Image src={(product as any).images[0]} alt={product.name} width={40} height={40} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FiBox className="text-[#D4AF37]/60" size={16} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="font-medium text-[#F8F4EE]">{product.name}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="font-mono text-xs text-[#F8F4EE]/50">{product.sku}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-[#F8F4EE]/60">{product.category}</span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex flex-col">
                        {product.discountPrice ? (
                          <>
                            <span className="font-medium text-[#F8F4EE]">{formatPrice(product.discountPrice)}</span>
                            <span className="text-xs text-[#F8F4EE]/40 line-through">{formatPrice(product.price)}</span>
                            <span className="text-xs text-green-600 font-medium">-{discountPct}%</span>
                          </>
                        ) : (
                          <span className="font-medium text-[#F8F4EE]">{formatPrice(product.price)}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockColor(product.stockQuantity)}`}>
                        <FiBox size={12} />
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => handleToggleStatus(product.id, product.name, product.isActive)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${
                          product.isActive
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : "bg-[#120A07] text-[#F8F4EE]/50 hover:bg-[#0A0503]"
                        }`}
                      >
                        {product.isActive ? "Active" : "Disabled"}
                      </button>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1">
                        {product.isFeatured && (
                          <span className="flex items-center gap-0.5 text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                            <FiStar size={10} /> Featured
                          </span>
                        )}
                        {product.isBestSeller && (
                          <span className="flex items-center gap-0.5 text-[10px] font-medium text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                            <FiStar size={10} /> Best
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-1.5 rounded-lg text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
                          title="Edit"
                        >
                          <FiEdit size={15} />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(product)}
                          className="p-1.5 rounded-lg text-[#F8F4EE]/60 hover:text-[#D4AF37] hover:bg-[#120A07] transition-colors"
                          title="Duplicate"
                        >
                          <FiCopy size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50/10 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedProducts.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-[#F8F4EE]/40">
                    <FiPackage size={32} className="mx-auto mb-2 opacity-40" />
                    <p>No products found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-[#D4AF37]/10">
          <div className="flex items-center gap-3">
            {selectedIds.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <FiTrash2 size={14} />
                Delete ({selectedIds.size})
              </button>
            )}
            <span className="text-sm text-[#F8F4EE]/50">
              {filteredProducts.length} product{filteredProducts.length !== 1 && "s"}
            </span>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg text-[#F8F4EE]/40 hover:text-[#F8F4EE] hover:bg-[#120A07] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                    page === currentPage
                      ? "bg-[#D4AF37] text-[#0A0503]"
                      : "text-[#F8F4EE]/50 hover:bg-[#120A07]"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg text-[#F8F4EE]/40 hover:text-[#F8F4EE] hover:bg-[#120A07] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
