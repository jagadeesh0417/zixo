"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const testimonials = [
  {
    name: "Priya Sharma",
    initials: "PS",
    avatar: "/images/general/testimonial-1.svg",
    text: "Absolutely the best cookies I have ever had! The Chocolate Chip cookies are divine. They arrived fresh and the packaging was beautiful. My whole family loved them!",
    rating: 5,
    gradient: "from-pink-400 to-rose-500",
  },
  {
    name: "Rahul Verma",
    initials: "RV",
    avatar: "/images/general/testimonial-2.svg",
    text: "Ordered the Signature Mixed Box for a party and it was a huge hit. Every cookie was unique and delicious. Fast delivery and great presentation. Will order again!",
    rating: 5,
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    name: "Ananya Gupta",
    initials: "AG",
    avatar: "/images/general/testimonial-3.svg",
    text: "The Red Velvet cookies are to die for! So soft, chewy, and the cream cheese drizzle is perfect. Zixo Cookies has become my go-to for gifting.",
    rating: 5,
    gradient: "from-purple-400 to-pink-500",
  },
  {
    name: "Arjun Patel",
    initials: "AP",
    avatar: "/images/general/testimonial-4.svg",
    text: "Finally a bakery that understands quality. The Double Chocolate Fudge is rich and indulgent. You can taste the premium ingredients in every bite. Highly recommended!",
    rating: 5,
    gradient: "from-amber-400 to-orange-500",
  },
  {
    name: "Neha Singh",
    initials: "NS",
    avatar: "/images/general/testimonial-1.svg",
    text: "As a cookie lover, I can confidently say Zixo makes the best cookies in town. The Oreo Delight is my personal favorite. Fresh, delicious, and worth every penny!",
    rating: 5,
    gradient: "from-emerald-400 to-teal-500",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  const t = testimonials[current];

  return (
    <section className="py-16 md:py-24 bg-dark overflow-hidden">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="gold-divider mx-auto mb-4" />
          <p className="section-subtitle">
            Loved by cookie enthusiasts across India
          </p>
        </motion.div>

        <div className="relative">
          <div className="flex items-center gap-4 md:gap-8">
            <button
              onClick={prev}
              className="flex w-8 h-8 md:w-12 md:h-12 rounded-full border border-gold/30 text-gold items-center justify-center hover:bg-gold hover:text-dark transition-all shrink-0"
            >
              <FaChevronLeft size={14} />
            </button>

            <div className="flex-1 min-h-[280px] relative">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: "easeInOut" as const }}
                  className="glass-card rounded-2xl p-5 md:p-10 shadow-lg text-center"
                >
                  <FaQuoteLeft
                    className="text-gold/30 mx-auto mb-3 md:mb-4"
                    size={24}
                  />

                  <div className="relative w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-full overflow-hidden ring-2 ring-[#D4AF37]/30">
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                  </div>

                  <div className="flex justify-center gap-1 mb-3 md:mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <FaStar key={i} className="text-gold" size={14} />
                    ))}
                  </div>

                  <p className="text-cream/70 text-sm md:text-lg leading-relaxed mb-3 md:mb-4 italic">
                    &ldquo;{t.text}&rdquo;
                  </p>

                  <h4 className="font-playfair text-base md:text-lg font-semibold text-cream">
                    {t.name}
                  </h4>
                  <p className="text-gold text-xs md:text-sm">Verified Customer</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={next}
              className="flex w-8 h-8 md:w-12 md:h-12 rounded-full border border-gold/30 text-gold items-center justify-center hover:bg-gold hover:text-dark transition-all shrink-0"
            >
              <FaChevronRight size={14} />
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > current ? 1 : -1);
                  setCurrent(idx);
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === current
                    ? "bg-gold w-8"
                    : "bg-gold/30 hover:bg-gold/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
