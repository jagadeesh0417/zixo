"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import {
  FaCookieBite, FaHeart, FaLeaf, FaTruck, FaStar, FaCheck,
} from "react-icons/fa";
import Link from "next/link";

const stats = [
  { value: 5000, suffix: "+", label: "Happy Customers", icon: FaHeart },
  { value: 50, suffix: "+", label: "Cookie Varieties", icon: FaCookieBite },
  { value: 5, suffix: "+", label: "Years of Baking", icon: FaStar },
  { value: 100, suffix: "%", label: "Fresh Baked", icon: FaLeaf, isPercent: true },
];

function CountUp({ target, suffix, isPercent }: { target: number; suffix: string; isPercent?: boolean }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {isPercent ? count : count.toLocaleString()}{suffix}
    </span>
  );
}

const values = [
  {
    icon: FaCookieBite,
    title: "Quality",
    description:
      "We use only the finest ingredients — Belgian chocolate, European butter, and pure vanilla. Every cookie is a masterpiece of flavour and texture.",
  },
  {
    icon: FaLeaf,
    title: "Freshness",
    description:
      "Every batch is baked fresh on the day of delivery. We never use preservatives or artificial additives. Just pure, honest baking.",
  },
  {
    icon: FaHeart,
    title: "Customer Satisfaction",
    description:
      "Your happiness is our mission. From the first bite to the last crumb, we ensure every experience with Zixo Cookies is exceptional.",
  },
];

export default function AboutPage() {
  const storyRef = useRef(null);
  const missionRef = useRef(null);
  const promiseRef = useRef(null);
  const storyInView = useInView(storyRef, { once: true, margin: "-100px" });
  const missionInView = useInView(missionRef, { once: true, margin: "-100px" });
  const promiseInView = useInView(promiseRef, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen bg-dark">
      <div className="relative bg-dark py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 text-gold/10 text-8xl">🍪</div>
          <div className="absolute bottom-10 right-10 text-gold/10 text-8xl">❤</div>
          <div className="absolute top-1/4 right-1/4 text-gold/10 text-6xl">✦</div>
          <div className="absolute bottom-1/4 left-1/3 text-gold/10 text-5xl">★</div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gold/10 backdrop-blur-sm text-gold text-sm font-medium px-4 py-1.5 rounded-full border border-gold/30 mb-4"
          >
            <FaCookieBite size={14} /> Our Story
          </motion.div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-2 md:mb-3 leading-tight px-2">
            Crafted With Passion,{" "}
            <span className="text-gold">Shared With Love</span>
          </h1>
          <p className="text-cream/60 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
            The Story of Zixo Cookies
          </p>
        </motion.div>
      </div>

      <section ref={storyRef} className="py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={storyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="section-title">Our Story</h2>
            <div className="gold-divider w-20 h-1 mx-auto rounded-full mb-4" />
            <p className="section-subtitle text-cream/60">
              From a home kitchen to your doorstep
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="w-full lg:w-1/2"
            >
              <div className="relative w-full h-72 md:h-[400px] rounded-2xl border border-gold/20 overflow-hidden shadow-lg">
                <Image src="/images/general/about-story.svg" alt="Zixo Cookies bakery story" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="w-full lg:w-1/2 space-y-5"
            >
              <p className="text-cream/80 leading-relaxed text-lg">
                Zixo Cookies began as a humble home bakery driven by a single
                belief — that a perfectly baked cookie has the power to brighten
                anyone&apos;s day. What started as weekend baking experiments
                soon became a beloved local treasure.
              </p>
              <p className="text-cream/70 leading-relaxed">
                Our founder, driven by an unwavering passion for baking,
                spent years perfecting every recipe. Countless trials led to the
                discovery of our signature texture — perfectly crisp on the
                outside, soft and chewy on the inside, with layers of flavour
                in every bite.
              </p>
              <p className="text-cream/70 leading-relaxed">
                Today, Zixo Cookies has grown into a brand that stands for
                uncompromising quality. We source the finest ingredients from
                around the world — Belgian chocolate, European butter,
                free-range eggs, and pure Madagascar vanilla. Every cookie is a
                testament to our commitment to excellence.
              </p>
              <p className="text-cream/70 leading-relaxed">
                But some things haven&apos;t changed. Every batch is still
                baked with the same love and care as that very first cookie.
                Because at Zixo, we don&apos;t just bake cookies — we create
                moments of happiness, one crumb at a time.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-dark-card">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="section-title">By The Numbers</h2>
            <div className="gold-divider w-20 h-1 mx-auto rounded-full mb-4" />
            <p className="section-subtitle text-cream/60">
              Our journey in numbers
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card rounded-2xl p-6 md:p-8 text-center border border-gold/20"
              >
                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center text-gold mx-auto mb-4">
                  <stat.icon size={24} />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gold mb-1">
                  <CountUp
                    target={stat.value}
                    suffix={stat.suffix}
                    isPercent={stat.isPercent}
                  />
                </div>
                <p className="text-sm text-cream/60">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section ref={missionRef} className="py-12 md:py-24 bg-dark-card">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={missionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="section-title">Our Mission</h2>
            <div className="gold-divider w-20 h-1 mx-auto rounded-full mb-4" />
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={missionInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="w-full lg:w-1/2 space-y-6"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-cream leading-tight">
                Bringing Happiness,{" "}
                <span className="text-gold">One Cookie At A Time</span>
              </h3>
              <div className="w-16 h-1 bg-gold/30 rounded-full" />
              <p className="text-cream/80 leading-relaxed text-lg">
                Our mission is simple — to create the most delicious,
                high-quality cookies that bring joy to every occasion. We believe
                that everyone deserves access to premium, freshly baked treats
                made with love and the finest ingredients.
              </p>
              <p className="text-cream/70 leading-relaxed">
                We&apos;re committed to sustainable sourcing, minimal packaging,
                and supporting local communities. Every cookie you enjoy from
                Zixo is a step toward a sweeter, more connected world.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={missionInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="w-full lg:w-1/2"
            >
              <div className="relative w-full h-72 md:h-[400px] rounded-2xl border border-gold/20 overflow-hidden shadow-lg">
                <Image src="/images/products/mixed-box.svg" alt="Zixo Cookies assortment" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={missionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          >
            {values.map((val, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-6 md:p-8 border border-gold/20"
              >
                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-4">
                  <val.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-cream mb-2">
                  {val.title}
                </h3>
                <p className="text-cream/70 text-sm leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section ref={promiseRef} className="bg-dark-card py-16 md:py-20 relative overflow-hidden border-t border-gold/20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 right-0 h-px bg-gold/30" />
          <div className="absolute top-10 left-10 text-gold/20 text-8xl">✦</div>
          <div className="absolute bottom-10 right-10 text-gold/20 text-8xl">✦</div>
        </div>
        <div className="max-w-4xl mx-auto px-3 sm:px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={promiseInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
                  <FaCookieBite className="text-gold/30 mx-auto mb-3 md:mb-4" size={36} />
            <h2 className="text-2xl md:text-4xl font-bold text-cream mb-3 md:mb-4">
              The Zixo Promise
            </h2>
            <div className="w-12 md:w-16 h-1 bg-gold/30 mx-auto rounded-full mb-4 md:mb-6" />
            <p className="text-cream/70 text-sm md:text-lg leading-relaxed max-w-2xl mx-auto mb-6 md:mb-8">
              We promise to deliver nothing less than perfection. From our
              kitchen to your table, every cookie is crafted with premium
              ingredients, baked fresh, and packed with love. If you&apos;re not
              completely satisfied, we&apos;ll make it right — no questions asked.
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-6">
              {[
                "Premium Ingredients",
                "Fresh Baked Daily",
                "Love in Every Bite",
                "100% Satisfaction",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-gold/10 backdrop-blur-sm text-gold/80 px-4 py-2 rounded-full text-sm font-medium border border-gold/20"
                >
                  <FaCheck size={12} className="text-gold" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Behind Every Cookie</h2>
            <div className="gold-divider w-20 h-1 mx-auto rounded-full mb-4" />
            <p className="section-subtitle text-cream/60">
              The passionate team that makes it all possible
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Chef Subhani",
                role: "Founder & Head Baker",
                bg: "from-gold/30 to-gold/10",
              },
              {
                name: "Chef Priya",
                role: "Pastry Chef",
                bg: "from-gold/20 to-gold/5",
              },
              {
                name: "Chef Rahul",
                role: "Quality & Innovation",
                bg: "from-gold/20 to-dark",
              },
            ].map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card rounded-2xl overflow-hidden border border-gold/20"
              >
                <div
                   className={`w-full h-48 md:h-56 bg-gradient-to-br ${member.bg} flex items-center justify-center relative`}
                >
                  <FaCookieBite
                    size={60}
                    className="text-gold/20"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-cream">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gold font-medium">
                    {member.role}
                  </p>
                  <p className="text-cream/50 text-xs mt-2">
                    Dedicated to crafting the perfect cookie experience
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-dark-card py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">Ready to Taste the Love?</h2>
            <div className="gold-divider w-20 h-1 mx-auto rounded-full mb-6" />
            <p className="text-cream/60 mb-8 max-w-xl mx-auto">
              Explore our collection of freshly baked gourmet cookies and
              experience the Zixo difference for yourself.
            </p>
            <Link href="/shop" className="btn-primary inline-flex items-center gap-2">
              <FaCookieBite size={16} />
              Browse Our Cookies
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
