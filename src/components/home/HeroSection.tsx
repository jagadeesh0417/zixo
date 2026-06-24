"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FaCookieBite,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaArrowRight,
  FaTruck,
  FaClock,
} from "react-icons/fa";

interface Slide {
  heading: [string, string];
  description: string;
  image: string;
}

const slides: Slide[] = [
  {
    heading: ["Freshly Baked Happiness", "Delivered to Your Door"],
    description: "Handcrafted gourmet cookies made with premium ingredients",
    image: "/images/banner.png",
  },
  {
    heading: ["Indulge in Our", "Signature Collection"],
    description: "Belgian chocolate, European butter, pure love in every bite",
    image: "/images/banners/hero-slide-2.svg",
  },
  {
    heading: ["Perfect Gifts For", "Every Occasion"],
    description: "Beautifully packed gift boxes that spread joy",
    image: "/images/banners/hero-slide-3.svg",
  },
  {
    heading: ["Taste The", "Zixo Difference"],
    description: "Where tradition meets innovation in every cookie",
    image: "/images/banners/hero-slide-4.svg",
  },
];

const floatingItems = [
  { emoji: "\u{1F36A}", x: 5, y: 10, delay: 0, size: 36 },
  { emoji: "\u2728", x: 90, y: 8, delay: 0.3, size: 22 },
  { emoji: "\u{1F36A}", x: 15, y: 75, delay: 0.6, size: 30 },
  { emoji: "\u2B50", x: 80, y: 80, delay: 0.9, size: 26 },
  { emoji: "\u{1F36A}", x: 92, y: 60, delay: 1.2, size: 34 },
  { emoji: "\u2728", x: 8, y: 45, delay: 0.4, size: 18 },
  { emoji: "\u{1F36A}", x: 50, y: 88, delay: 0.7, size: 28 },
  { emoji: "\u2B50", x: 65, y: 5, delay: 1.0, size: 20 },
];

const stats = [
  { icon: FaStar, value: "5000+", label: "Happy Customers" },
  { icon: FaCookieBite, value: "50+", label: "Varieties" },
  { icon: FaTruck, value: "Free", label: "Delivery" },
  { icon: FaClock, value: "Freshly", label: "Baked" },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 800 : -800,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring" as const, stiffness: 300, damping: 30 },
      opacity: { duration: 0.4 },
      scale: { duration: 0.4 },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 800 : -800,
    opacity: 0,
    scale: 0.95,
    transition: {
      x: { type: "spring" as const, stiffness: 300, damping: 30 },
      opacity: { duration: 0.3 },
      scale: { duration: 0.3 },
    },
  }),
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function HeroSection() {
  const [[current, direction], setCurrent] = useState<[number, number]>([0, 0]);
  const [isPaused, setIsPaused] = useState(false);

  const slideCount = slides.length;

  const goTo = useCallback((index: number) => {
    setCurrent(([prev]) => {
      const dir = index > prev ? 1 : index < prev ? -1 : 0;
      return [index, dir];
    });
  }, []);

  const next = useCallback(() => {
    setCurrent(([prev]) => {
      const nextIndex = (prev + 1) % slideCount;
      return [nextIndex, 1];
    });
  }, [slideCount]);

  const prev = useCallback(() => {
    setCurrent(([prev]) => {
      const prevIndex = (prev - 1 + slideCount) % slideCount;
      return [prevIndex, -1];
    });
  }, [slideCount]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  const slide = slides[current];

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-dark"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Floating decorative elements */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {floatingItems.map((item, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              fontSize: item.size,
            }}
            animate={{ y: [0, -25, 0], rotate: [0, 12, -8, 0] }}
            transition={{
              duration: 5 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut" as const,
              delay: item.delay,
            }}
          >
            <span className="block opacity-50">{item.emoji}</span>
          </motion.div>
        ))}
      </div>

      {/* Slides */}
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          <div className="absolute inset-0" style={{ backgroundImage: `url(${slide.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-20 flex flex-col items-center justify-center min-h-screen text-center px-4 sm:px-6"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-gold text-sm font-medium px-4 py-2 rounded-full border border-gold/30 mb-6">
                <FaCookieBite /> Premium Gourmet Cookies
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            >
              {slide.heading[0]}{" "}
              <span className="text-gradient">{slide.heading[1]}</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-cream/80 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              {slide.description}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/shop" className="btn-primary text-base px-8 py-4">
                <FaCookieBite size={18} />
                Shop Cookies
              </Link>
              <Link href="/shop" className="btn-secondary text-base px-8 py-4">
                Explore Flavors
                <FaArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-gold hover:bg-gold/20 hover:border-gold/50 transition-all duration-300"
        aria-label="Previous slide"
      >
        <FaChevronLeft size={20} />
      </button>

      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-gold hover:bg-gold/20 hover:border-gold/50 transition-all duration-300"
        aria-label="Next slide"
      >
        <FaChevronRight size={20} />
      </button>

      {/* Navigation dots */}
      <div className="absolute bottom-36 md:bottom-40 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "bg-gold w-8 h-3"
                : "bg-gold/30 hover:bg-gold/50 w-3 h-3"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Stats bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        <div className="max-w-5xl mx-auto px-4 pb-6 md:pb-8">
          <div className="glass rounded-2xl border border-gold/20 px-4 md:px-8 py-4 md:py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 justify-center md:justify-start"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <stat.icon className="text-gold" size={18} />
                  </div>
                  <div>
                    <p className="text-gold font-bold text-sm md:text-base">
                      {stat.value}
                    </p>
                    <p className="text-cream/60 text-xs md:text-sm">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
