"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqs = [
  {
    question: "How fresh are your cookies?",
    answer:
      "All our cookies are baked fresh on the day of delivery. We never use preservatives or bake in advance. Every batch is made to order, ensuring you receive cookies at their peak freshness and flavour.",
  },
  {
    question: "What ingredients do you use?",
    answer:
      "We use only premium ingredients — real butter, Belgian chocolate, free-range eggs, and pure vanilla extract. All our ingredients are carefully sourced from trusted suppliers. We avoid artificial flavours, colours, and preservatives.",
  },
  {
    question: "How long do cookies stay fresh?",
    answer:
      "Our cookies stay fresh for 7-10 days when stored in an airtight container at room temperature. For best taste, we recommend consuming within 5 days of delivery. You can also freeze them for up to a month.",
  },
  {
    question: "Do you offer gift boxes?",
    answer:
      "Yes! Our Signature Mixed Box makes the perfect gift for any occasion. We offer beautiful packaging with personalised messages. Gift boxes are available in various sizes and can be customised with your favourite cookie selection.",
  },
  {
    question: "How fast is delivery?",
    answer:
      "We offer same-day and next-day delivery within our serviceable areas. Orders placed before 12 PM are eligible for same-day delivery. Free delivery is available on orders above ₹299 within your city.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 md:py-24 bg-dark">
      <div className="max-w-3xl mx-auto px-3 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="gold-divider" />
          <p className="section-subtitle">
            Everything you need to know about Zixo Cookies
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-3"
        >
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`bg-dark-card rounded-xl overflow-hidden border transition-all duration-300 ${
                  isOpen ? "border-gold/30 shadow-lg shadow-gold/5" : "border-gold/10"
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left"
                >
                  <span
                    className={`font-playfair text-base md:text-lg font-semibold pr-4 transition-colors ${
                      isOpen ? "text-gold" : "text-cream"
                    } hover:text-gold`}
                  >
                    {faq.question}
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
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
