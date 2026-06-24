"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaCookieBite, FaPaperPlane } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Welcome to the Zixo Cookie Club! 🎉");
    setEmail("");
  };

  return (
    <section className="py-16 md:py-24 bg-dark-card">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="glass-card border-gold/20 rounded-3xl p-8 md:p-12 text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center"
          >
            <FaCookieBite className="text-gold" size={28} />
          </motion.div>

          <div className="gold-divider mb-6" />

          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-cream mb-3">
            Join The Zixo Cookie Club
          </h2>
          <p className="text-cream/60 mb-8 max-w-md mx-auto">
            Subscribe for exclusive offers, new flavours, and baking updates
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="input-field flex-1"
            />
            <button
              type="submit"
              className="btn-primary whitespace-nowrap justify-center"
            >
              <FaPaperPlane size={14} />
              Subscribe
            </button>
          </form>

          <p className="text-xs text-cream/40 mt-4">
            No spam. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
