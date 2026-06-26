"use client";

import { useState, useMemo, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  FaChevronDown, FaChevronUp, FaSearch, FaCookieBite, FaArrowRight,
} from "react-icons/fa";
import Link from "next/link";

const faqs = [
  {
    question: "How fresh are your cookies?",
    answer:
      "All our cookies are baked fresh on the day of delivery. We never use preservatives or artificial ingredients. Our baking team starts early each morning to ensure your cookies are at peak freshness when they arrive at your doorstep.",
  },
  {
    question: "What ingredients do you use?",
    answer:
      "We use only premium ingredients: Belgian chocolate, European butter, free-range eggs, and pure vanilla extract. We source our ingredients from trusted suppliers worldwide. No preservatives, no artificial flavors, no compromises.",
  },
  {
    question: "How long do cookies stay fresh?",
    answer:
      "Our cookies stay fresh for 7-10 days when stored in an airtight container at room temperature. For longer storage, you can freeze them for up to 3 months. Simply warm them in the oven for 5 minutes to enjoy that fresh-baked taste.",
  },
  {
    question: "Do you offer gift boxes?",
    answer:
      "Yes! Our Signature Mixed Box is the perfect gift for any occasion. We also offer custom gift boxes for corporate events, weddings, and special celebrations. Contact us for bulk orders and personalized packaging options.",
  },
  {
    question: "How fast is delivery?",
    answer:
      "We offer same-day delivery within the city for orders placed before 12 PM. Next-day delivery is available for all areas. Free delivery on orders above \u20B9499. You can track your order in real-time once it's dispatched.",
  },
  {
    question: "What is your return policy?",
    answer:
      "Customer satisfaction is our priority. If you're not happy with your order, please contact us within 24 hours of delivery and we'll make it right. We offer replacements or refunds for damaged or unsatisfactory products.",
  },
  {
    question: "Do you offer custom orders?",
    answer:
      "Yes! We love creating custom cookie orders for weddings, corporate events, parties, and special occasions. Please contact us with your requirements and we'll create the perfect cookie experience for you.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;
    const q = searchQuery.toLowerCase();
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-gold/20 text-gold font-medium rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="min-h-screen bg-dark">
      <div className="relative bg-gradient-to-b from-dark to-[#0A0503] py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 text-gold/10 text-8xl">?</div>
          <div className="absolute bottom-10 right-10 text-gold/10 text-8xl">!</div>
          <div className="absolute top-1/3 right-1/4 text-gold/10 text-6xl">✦</div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gold/10 backdrop-blur-sm text-gold text-sm font-medium px-4 py-1.5 rounded-full border border-gold/30 mb-4"
          >
            <FaCookieBite size={14} /> Got Questions?
          </motion.div>
          <h1 className="section-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-cream/60 text-lg max-w-xl mx-auto">
            Everything you need to know about Zixo Cookies
          </p>
        </motion.div>
      </div>

      <div ref={ref} className="max-w-3xl mx-auto px-3 sm:px-4 py-8 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="relative mb-10"
        >
          <FaSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/30"
            size={18}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setOpenIndex(null);
            }}
            placeholder="Search questions or answers..."
            className="input-field w-full pl-12 pr-4 py-3.5 border border-gold/20 rounded-xl text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream/60 transition-colors text-xs"
            >
              Clear
            </button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-3"
        >
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const actualIdx = faqs.indexOf(faq);
              const isOpen = openIndex === actualIdx;
              return (
                <motion.div
                  key={actualIdx}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={`glass-card rounded-xl overflow-hidden border transition-all duration-300 ${
                    isOpen
                      ? "border-gold/30 shadow-lg shadow-gold/10"
                      : "border-gold/20"
                  }`}
                >
                  <button
                    onClick={() => toggle(actualIdx)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left"
                  >
                    <span
                      className={`text-base md:text-lg font-medium pr-4 ${
                        isOpen ? "text-gold" : "text-cream hover:text-gold"
                      }`}
                    >
                      {searchQuery
                        ? highlightText(faq.question, searchQuery)
                        : faq.question}
                    </span>
                    {isOpen ? (
                      <FaChevronUp className="text-gold shrink-0" size={16} />
                    ) : (
                      <FaChevronDown className="text-gold shrink-0" size={16} />
                    )}
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" as const }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 md:px-6 pb-5 md:pb-6 text-cream/70 leading-relaxed">
                          {searchQuery
                            ? highlightText(faq.answer, searchQuery)
                            : faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="text-5xl mb-4 opacity-30">🔍</div>
              <h3 className="text-xl font-semibold text-cream mb-2">
                No results found
              </h3>
              <p className="text-cream/60 text-sm mb-4">
                No FAQ items match your search &ldquo;{searchQuery}&rdquo;
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-gold hover:text-gold/80 text-sm font-medium transition-colors"
              >
                Clear search
              </button>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 md:mt-16 text-center glass-card rounded-xl md:rounded-2xl p-6 md:p-12 border border-gold/20"
        >
          <h2 className="text-xl md:text-3xl font-bold text-cream mb-2 md:mb-3">
            Still have questions?
          </h2>
          <p className="text-cream/60 mb-4 md:mb-6 max-w-md mx-auto text-sm md:text-base">
            We&apos;re here to help you. Reach out to us and we&apos;ll get back
            to you as soon as possible.
          </p>
          <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
            Contact Us
            <FaArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
