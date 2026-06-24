"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FiBox,
  FiSearch,
  FiDownload,
  FiEdit,
  FiChevronLeft,
  FiChevronRight,
  FiAlertCircle,
  FiCheckCircle,
  FiPackage,
  FiPlus,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/utils";

const sampleProducts = [
  { id: "1", name: "Classic Chocolate Chip", sku: "ZIXO-CC-001", category: "Chocolate", stock: 45, lastRestocked: "2026-06-15" },
  { id: "2", name: "Double Oreo Delight", sku: "ZIXO-OD-002", category: "Oreo", stock: 30, lastRestocked: "2026-06-12" },
  { id: "3", name: "Red Velvet Bliss", sku: "ZIXO-RV-003", category: "Red Velvet", stock: 3, lastRestocked: "2026-05-28" },
  { id: "4", name: "Butter Classic", sku: "ZIXO-BC-004", category: "Butter", stock: 60, lastRestocked: "2026-06-20" },
  { id: "5", name: "Chocolate Fudge Supreme", sku: "ZIXO-CF-005", category: "Chocolate", stock: 12, lastRestocked: "2026-06-08" },
  { id: "6", name: "Oreo Cheesecake", sku: "ZIXO-OC-006", category: "Oreo", stock: 0, lastRestocked: "2026-05-10" },
  { id: "7", name: "Red Velvet Truffle", sku: "ZIXO-RT-007", category: "Red Velvet", stock: 18, lastRestocked: "2026-06-05" },
  { id: "8", name: "Butter Pecan Crunch", sku: "ZIXO-BP-008", category: "Butter", stock: 8, lastRestocked: "2026-06-01" },
  { id: "9", name: "Assorted Gift Box (12 pcs)", sku: "ZIXO-MB-009", category: "Mixed Boxes", stock: 25, lastRestocked: "2026-06-18" },
  { id: "10", name: "Chocolate Walnut Brownie", sku: "ZIXO-CW-010", category: "Chocolate", stock: 2, lastRestocked: "2026-05-22" },
  { id: "11", name: "Oreo Chocolate Drizzle", sku: "ZIXO-OD-011", category: "Oreo", stock: 55, lastRestocked: "2026-06-22" },
  { id: "12", name: "Butter Toffee Crunch", sku: "ZIXO-BT-012", category: "Butter", stock: 0, lastRestocked: "2026-04-15" },
];

const categories = ["All", "Chocolate", "Oreo", "Red Velvet", "Butter", "Mixed Boxes"];
const stockFilters = ["All", "In Stock", "Low Stock", "Out of Stock"];
const perPage = 10;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AdminInventoryPage() {
  const [products, setProducts] = useState(sampleProducts);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingStock, setEditingStock] = useState<string | null>(null);
  const [stockInput, setStockInput] = useState<number>(0);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    if (categoryFilter !== "All") {
      result = result.filter((p) => p.category === categoryFilter);
    }
    if (stockFilter !== "All") {
      if (stockFilter === "In Stock") result = result.filter((p) => p.stock > 20);
      else if (stockFilter === "Low Stock") result = result.filter((p) => p.stock >= 1 && p.stock <= 20);
      else if (stockFilter === "Out of Stock") result = result.filter((p) => p.stock === 0);
    }
    return result;
  }, [products, search, stockFilter, categoryFilter]);

  const totalPages = Math.ceil(filteredProducts.length / perPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * perPage, currentPage * perPage);

  const totalProducts = products.length;
  const inStock = products.filter((p) => p.stock > 20).length;
  const lowStock = products.filter((p) => p.stock >= 1 && p.stock <= 20).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  const lowStockItems = products.filter((p) => p.stock >= 1 && p.stock <= 20);
  const outOfStockItems = products.filter((p) => p.stock === 0);

  const getStockStatus = (qty: number) => {
    if (qty > 20) return { label: "In Stock", color: "bg-green-50 text-green-700" };
    if (qty >= 1) return { label: "Low Stock", color: "bg-yellow-50 text-yellow-700" };
    return { label: "Out of Stock", color: "bg-red-50 text-red-700" };
  };

  const getStockBarColor = (qty: number) => {
    if (qty > 20) return "bg-green-500";
    if (qty >= 1) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStockPercentage = (qty: number) => {
    const max = Math.max(...products.map((p) => p.stock), 1);
    return Math.min(Math.round((qty / max) * 100), 100);
  };

  const handleUpdateStock = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, stock: stockInput, lastRestocked: new Date().toISOString().split("T")[0] }
          : p
      )
    );
    setEditingStock(null);
    toast.success("Stock updated successfully!");
  };

  const startEditing = (id: string, currentStock: number) => {
    setEditingStock(id);
    setStockInput(currentStock);
  };

  const handleAddStock = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      const newStock = product.stock + 50;
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, stock: newStock, lastRestocked: new Date().toISOString().split("T")[0] } : p
        )
      );
      toast.success(`Added 50 units to "${product.name}"`);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-chocolate">
            Inventory <span className="text-caramel">Management</span>
          </h1>
          <p className="text-gray-500 mt-1">Track stock levels, manage inventory, and restock products.</p>
        </div>
        <button
          onClick={() => toast.success("Exporting inventory data...")}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-caramel text-chocolate rounded-xl font-medium text-sm hover:bg-caramel/90 transition-all hover:shadow-lg hover:shadow-caramel/25 self-start"
        >
          <FiDownload size={16} />
          Export Inventory
        </button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Products", value: totalProducts, icon: FiPackage, color: "text-blue-600 bg-blue-50" },
          { label: "In Stock", value: inStock, icon: FiCheckCircle, color: "text-green-600 bg-green-50" },
          { label: "Low Stock", value: lowStock, icon: FiAlertCircle, color: "text-red-600 bg-red-50" },
          { label: "Out of Stock", value: outOfStock, icon: FiBox, color: "text-gray-500 bg-gray-100" },
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

      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <motion.div variants={itemVariants} className="mb-6">
          <div className="admin-card border-l-4 border-l-red-400 bg-red-50/50">
            <div className="flex items-start gap-3">
              <FiAlertCircle className="text-red-500 mt-0.5 shrink-0" size={20} />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-red-800 mb-2">Low Stock Alert</h3>
                <p className="text-sm text-red-600 mb-3">
                  {lowStockItems.length > 0 && `${lowStockItems.length} product(s) running low on stock.`}
                  {lowStockItems.length > 0 && outOfStockItems.length > 0 && " "}
                  {outOfStockItems.length > 0 && `${outOfStockItems.length} product(s) are out of stock.`}
                </p>
                <div className="flex flex-wrap gap-2">
                  {lowStockItems.slice(0, 4).map((item) => (
                    <div key={item.id} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-yellow-200 text-sm">
                      <FiAlertCircle className="text-yellow-500 shrink-0" size={14} />
                      <span className="text-yellow-800 font-medium">{item.name}</span>
                      <span className="text-yellow-600">({item.stock} left)</span>
                      <button
                        onClick={() => handleAddStock(item.id)}
                        className="flex items-center gap-1 text-xs font-medium text-green-600 hover:text-green-700 ml-1"
                      >
                        <FiPlus size={12} />
                        Add Stock
                      </button>
                    </div>
                  ))}
                  {outOfStockItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-red-200 text-sm">
                      <FiAlertCircle className="text-red-500 shrink-0" size={14} />
                      <span className="text-red-800 font-medium">{item.name}</span>
                      <span className="text-red-600">(Out of Stock)</span>
                      <button
                        onClick={() => handleAddStock(item.id)}
                        className="flex items-center gap-1 text-xs font-medium text-green-600 hover:text-green-700 ml-1"
                      >
                        <FiPlus size={12} />
                        Add Stock
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="admin-card mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search by name or SKU..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-chocolate placeholder:text-gray-400 focus:outline-none focus:border-caramel focus:bg-white transition-all"
            />
          </div>
          <select
            value={stockFilter}
            onChange={(e) => { setStockFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-chocolate focus:outline-none focus:border-caramel transition-all"
          >
            {stockFilters.map((f) => (
              <option key={f} value={f}>{f === "All" ? "All Stock Status" : f}</option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-chocolate focus:outline-none focus:border-caramel transition-all"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat === "All" ? "All Categories" : cat}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Product</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium">SKU</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Category</th>
                <th className="text-right py-3 px-2 text-gray-500 font-medium">Current Stock</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Status</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Stock Level</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Last Restocked</th>
                <th className="text-center py-3 px-2 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => {
                const status = getStockStatus(product.stock);
                const pct = getStockPercentage(product.stock);
                const isEditing = editingStock === product.id;
                return (
                  <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-caramel to-amber-300 flex items-center justify-center shrink-0">
                          <FiPackage className="text-chocolate/60" size={16} />
                        </div>
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="font-medium text-gray-800 hover:text-caramel transition-colors"
                        >
                          {product.name}
                        </Link>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="font-mono text-xs text-gray-500">{product.sku}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-gray-600">{product.category}</span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className="font-semibold text-chocolate">{product.stock}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label === "Low Stock" && <FiAlertCircle size={11} />}
                        {status.label === "Out of Stock" && <FiAlertCircle size={11} />}
                        {status.label === "In Stock" && <FiCheckCircle size={11} />}
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${getStockBarColor(product.stock)}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-gray-400 w-8">{pct}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-gray-500 text-xs">{formatDate(product.lastRestocked)}</span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center justify-center gap-1">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min={0}
                              value={stockInput}
                              onChange={(e) => setStockInput(Number(e.target.value))}
                              className="w-16 px-2 py-1 text-xs border border-caramel rounded bg-white text-chocolate focus:outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => handleUpdateStock(product.id)}
                              className="p-1 rounded text-green-600 hover:bg-green-50 transition-colors"
                              title="Save"
                            >
                              <FiCheckCircle size={14} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditing(product.id, product.stock)}
                              className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                              title="Update Stock"
                            >
                              <FiBox size={15} />
                            </button>
                            <Link
                              href={`/admin/products/${product.id}`}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                              title="Edit Product"
                            >
                              <FiEdit size={15} />
                            </Link>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <FiPackage size={32} className="mx-auto mb-2 opacity-40" />
                    <p>No products found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">{filteredProducts.length} product{filteredProducts.length !== 1 && "s"}</span>
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
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
