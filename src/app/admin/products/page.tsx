"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiPackage,
  FiStar,
  FiBox,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";

interface AdminProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  discountPrice: number | null;
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  images: string[];
  category: { id: string; name: string };
  rating: number;
  createdAt: string;
}

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
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.products);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== "All") {
      result = result.filter((p) => p.category.name === categoryFilter);
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

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        toast.success("Product deleted successfully");
      } else {
        toast.error(data.error || "Failed to delete product");
      }
    } catch {
      toast.error("Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark p-8">
        <p className="text-cream/60">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-playfair text-cream">Products</h1>
          <p className="text-sm text-cream/60 mt-1">Manage your cookie inventory</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary self-start">
          <FiPlus size={16} />
          Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Products", value: totalProducts, icon: FiPackage, color: "gold" },
          { label: "Active", value: activeProducts, icon: FiStar, color: "green" },
          { label: "Low Stock", value: lowStockItems, icon: FiBox, color: "red" },
          { label: "Featured", value: featuredItems, icon: FiStar, color: "purple" },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-xl p-4 border border-gold/10">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-${stat.color}/10 flex items-center justify-center`}>
                <stat.icon className={`text-${stat.color}`} size={18} />
              </div>
              <div>
                <p className="text-2xl font-bold text-cream">{stat.value}</p>
                <p className="text-xs text-cream/60">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40" size={16} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full bg-dark-card border border-gold/20 rounded-lg pl-10 pr-4 py-2.5 text-sm text-cream placeholder-cream/40 focus:outline-none focus:border-gold/50"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
          className="bg-dark-card border border-gold/20 rounded-lg px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold/50"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          className="bg-dark-card border border-gold/20 rounded-lg px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold/50"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select
          value={stockFilter}
          onChange={(e) => { setStockFilter(e.target.value); setCurrentPage(1); }}
          className="bg-dark-card border border-gold/20 rounded-lg px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold/50"
        >
          <option value="All">All Stock</option>
          <option value="Low">Low (&lt;5)</option>
          <option value="Medium">Medium (5-20)</option>
          <option value="High">High (&gt;20)</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl border border-gold/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold/10 bg-dark-card">
                <th className="w-10 p-4">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    className="rounded border-gold/30 accent-gold"
                  />
                </th>
                <th className="text-left p-4 text-cream/60 font-medium">Product</th>
                <th className="text-left p-4 text-cream/60 font-medium">SKU</th>
                <th className="text-left p-4 text-cream/60 font-medium">Category</th>
                <th className="text-right p-4 text-cream/60 font-medium">Price</th>
                <th className="text-center p-4 text-cream/60 font-medium">Stock</th>
                <th className="text-center p-4 text-cream/60 font-medium">Status</th>
                <th className="text-center p-4 text-cream/60 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => (
                <motion.tr
                  key={product.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="border-b border-gold/5 hover:bg-gold/5 transition-colors"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(product.id)}
                      onChange={() => handleSelectOne(product.id)}
                      className="rounded border-gold/30 accent-gold"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-900/30 overflow-hidden flex-shrink-0 relative">
                        {product.images?.[0] ? (
                          <Image src={product.images[0]} alt="" fill className="object-cover" sizes="40px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gold/30">
                            <FiPackage size={18} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-cream">{product.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {product.isFeatured && <span className="text-[10px] bg-gold/20 text-gold px-1.5 py-0.5 rounded">Featured</span>}
                          {product.isBestSeller && <span className="text-[10px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded">Best Seller</span>}
                          <span className="text-[10px] text-cream/40">{product.rating.toFixed(1)} ★</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-cream/60 font-mono text-xs">{product.sku}</td>
                  <td className="p-4">
                    <span className="bg-gold/10 text-gold text-xs px-2 py-1 rounded-full">
                      {product.category.name}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-cream font-medium">{formatPrice(product.discountPrice || product.price)}</span>
                    {product.discountPrice && (
                      <span className="text-cream/40 line-through text-xs ml-1">{formatPrice(product.price)}</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      product.stockQuantity === 0 ? "bg-red-500/20 text-red-400" :
                      product.stockQuantity < 5 ? "bg-amber-500/20 text-amber-400" :
                      "bg-green-500/20 text-green-400"
                    }`}>
                      {product.stockQuantity}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      product.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    }`}>
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gold/10 text-gold hover:bg-gold/20 transition-colors"
                        title="Edit"
                      >
                        <FiEdit size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {paginatedProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-cream/40">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gold/10">
            <p className="text-sm text-cream/50">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gold/10 text-cream disabled:opacity-30 hover:bg-gold/20 transition-colors"
              >
                <FiChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    page === currentPage ? "bg-gold text-dark" : "bg-gold/10 text-cream hover:bg-gold/20"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gold/10 text-cream disabled:opacity-30 hover:bg-gold/20 transition-colors"
              >
                <FiChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
