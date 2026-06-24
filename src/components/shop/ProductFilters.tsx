"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaFilter, FaTimes, FaChevronDown } from "react-icons/fa";

const categories = [
  { value: "", label: "All" },
  { value: "chocolate", label: "Chocolate" },
  { value: "oreo", label: "Oreo" },
  { value: "red-velvet", label: "Red Velvet" },
  { value: "butter", label: "Butter" },
  { value: "mixed-boxes", label: "Mixed Boxes" },
];

const priceRanges = [
  { value: "", label: "All Prices" },
  { value: "0-200", label: "Under ₹200" },
  { value: "200-300", label: "₹200 - ₹300" },
  { value: "300-500", label: "₹300 - ₹500" },
  { value: "500-10000", label: "Above ₹500" },
];

const sortOptions = [
  { value: "", label: "Sort by" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price Low to High" },
  { value: "price-desc", label: "Price High to Low" },
  { value: "rating", label: "Best Rating" },
];

export interface FilterState {
  search: string;
  categories: string[];
  priceRange: string;
  sortBy: string;
}

interface ProductFiltersProps {
  onChange: (filters: FilterState) => void;
}

export default function ProductFilters({ onChange }: ProductFiltersProps) {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDesktop(window.innerWidth >= 768);
      const handleResize = () => setIsDesktop(window.innerWidth >= 768);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const emitChange = (overrides: Partial<FilterState>) => {
    onChange({
      search,
      categories: selectedCategories,
      priceRange,
      sortBy,
      ...overrides,
    });
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      emitChange({ search: value });
    }, 300);
  };

  const toggleCategory = (cat: string) => {
    const next = cat === ""
      ? []
      : selectedCategories.includes(cat)
        ? selectedCategories.filter((c) => c !== cat)
        : [...selectedCategories, cat];
    setSelectedCategories(next);
    setTimeout(() => emitChange({ categories: next }), 0);
  };

  const handlePriceRange = (value: string) => {
    setPriceRange(value);
    setTimeout(() => emitChange({ priceRange: value }), 0);
  };

  const handleSortBy = (value: string) => {
    setSortBy(value);
    setIsSortOpen(false);
    setTimeout(() => emitChange({ sortBy: value }), 0);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setPriceRange("");
    setSortBy("");
    onChange({ search: "", categories: [], priceRange: "", sortBy: "" });
  };

  const hasActiveFilters = search || selectedCategories.length > 0 || priceRange || sortBy;

  return (
    <div className="bg-dark-card rounded-2xl border border-gold/10 p-4 md:p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/40" size={15} />
          <input
            type="text"
            placeholder="Search cookies..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="input-field w-full pl-10 pr-4 py-2.5 rounded-full text-sm"
          />
          {search && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream transition-colors"
            >
              <FaTimes size={13} />
            </button>
          )}
        </div>

        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`md:hidden flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all ${
            isFilterOpen
              ? "bg-gold/10 border-gold text-gold"
              : "btn-outline"
          }`}
        >
          <FaFilter size={14} />
          Filters
        </button>

        <div className="relative hidden md:block" ref={sortRef}>
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gold/20 bg-dark-card text-cream/70 hover:border-gold/50 text-sm font-medium transition-all"
          >
            <FaChevronDown size={12} className={`transition-transform ${isSortOpen ? "rotate-180" : ""}`} />
            {sortBy ? sortOptions.find((o) => o.value === sortBy)?.label : "Sort by"}
          </button>
          <AnimatePresence>
            {isSortOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 bg-dark-card rounded-xl shadow-lg border border-gold/10 overflow-hidden z-30"
              >
                {sortOptions.slice(1).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortBy(option.value)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      sortBy === option.value
                        ? "bg-gold/10 text-gold font-medium"
                        : "text-cream/60 hover:bg-gold/5 hover:text-cream"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-gold/70 hover:text-gold whitespace-nowrap transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {(isFilterOpen || isDesktop) && (
          <motion.div
            initial={false}
            animate={
              !isDesktop
                ? { height: isFilterOpen ? "auto" : 0, opacity: isFilterOpen ? 1 : 0 }
                : { height: "auto", opacity: 1 }
            }
            transition={{ duration: 0.3, ease: "easeInOut" as const }}
            className="overflow-hidden md:overflow-visible"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 pt-4 border-t border-gold/10">
              <div>
                <span className="text-xs font-medium text-cream/50 uppercase tracking-wider block mb-2">
                  Category
                </span>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const isActive = cat.value === ""
                      ? selectedCategories.length === 0
                      : selectedCategories.includes(cat.value);
                    return (
                      <button
                        key={cat.value}
                        onClick={() => toggleCategory(cat.value)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          isActive
                            ? "bg-gold/10 border-gold text-gold"
                            : "btn-outline"
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="md:border-l md:border-gold/10 md:pl-8">
                <span className="text-xs font-medium text-cream/50 uppercase tracking-wider block mb-2">
                  Price Range
                </span>
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map((range) => {
                    const isActive = priceRange === range.value;
                    return (
                      <button
                        key={range.value}
                        onClick={() => handlePriceRange(range.value)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          isActive
                            ? "bg-gold/10 border-gold text-gold"
                            : "btn-outline"
                        }`}
                      >
                        {range.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="md:hidden">
                <span className="text-xs font-medium text-cream/50 uppercase tracking-wider block mb-2">
                  Sort By
                </span>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.slice(1).map((option) => {
                    const isActive = sortBy === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleSortBy(option.value)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          isActive
                            ? "bg-gold/10 border-gold text-gold"
                            : "btn-outline"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
