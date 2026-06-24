"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { FaYoutube, FaPlay } from "react-icons/fa";

const videos = [
  {
    title: "A Day in the Life at Zixo Cookies",
    description: "Watch how we bake our signature cookies from scratch",
    gradient: "from-amber-600 to-orange-700",
    duration: "12:34",
  },
  {
    title: "The Secret to Perfect Chocolate Chip Cookies",
    description: "Our master baker reveals the tips and tricks",
    gradient: "from-amber-700 to-brown-800",
    duration: "8:21",
  },
  {
    title: "Unboxing Our Signature Gift Boxes",
    description: "See what goes into our premium cookie hampers",
    gradient: "from-orange-600 to-red-700",
    duration: "6:45",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function YouTubeSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 md:py-24 bg-dark">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Behind The Scenes At Zixo Cookies</h2>
          <div className="gold-divider" />
          <p className="section-subtitle">Watch our baking journey</p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {videos.map((video, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className="group glass-card border-gold/10 overflow-hidden cursor-pointer"
            >
              <div className="relative overflow-hidden">
                <div
                  className={`w-full h-52 bg-gradient-to-br ${video.gradient} flex items-center justify-center`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 bg-gold/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-gold/50 group-hover:bg-gold/30 transition-colors"
                  >
                    <FaPlay className="text-gold ml-1" size={24} />
                  </motion.div>
                  <span className="absolute bottom-3 right-3 bg-black/60 text-cream text-xs px-2 py-1 rounded">
                    {video.duration}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <FaYoutube className="text-gold" size={18} />
                  <span className="text-xs text-cream/50 uppercase tracking-wider">
                    Video
                  </span>
                </div>
                <h3 className="font-playfair text-lg font-semibold text-cream mb-2 group-hover:text-gold transition-colors">
                  {video.title}
                </h3>
                <p className="text-cream/60 text-sm leading-relaxed">
                  {video.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-10"
        >
          <Link
            href="https://youtube.com/@subhani-04"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-3"
          >
            <FaYoutube size={18} />
            Subscribe on YouTube
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
