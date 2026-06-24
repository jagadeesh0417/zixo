"use client";

import { useState, useRef, FormEvent } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import {
  FaPhone, FaWhatsapp, FaInstagram, FaYoutube, FaEnvelope,
  FaMapMarkerAlt, FaClock, FaPaperPlane, FaCheck, FaCookieBite,
} from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-hot-toast";

const contactInfo = [
  {
    icon: FaPhone,
    label: "Phone",
    value: "+91 80966 97748",
    href: "tel:+918096697748",
  },
  {
    icon: FaWhatsapp,
    label: "WhatsApp",
    value: "+91 80966 97748",
    href: "https://wa.me/918096697748",
  },
  {
    icon: FaInstagram,
    label: "Instagram",
    value: "@zixo_cookies",
    href: "https://www.instagram.com/zixo_cookies",
  },
  {
    icon: FaYoutube,
    label: "YouTube",
    value: "@subhani-04",
    href: "https://youtube.com/@subhani-04",
  },
  {
    icon: FaEnvelope,
    label: "Email",
    value: "hello@zixocookies.com",
    href: "mailto:hello@zixocookies.com",
  },
];

const businessHours = [
  { day: "Mon - Sat", hours: "9:00 AM - 8:00 PM" },
  { day: "Sunday", hours: "10:00 AM - 6:00 PM" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Invalid email address";
    if (!formData.phone.trim()) errs.phone = "Phone is required";
    else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone))
      errs.phone = "Invalid phone number";
    if (!formData.subject.trim()) errs.subject = "Subject is required";
    if (!formData.message.trim()) errs.message = "Message is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setErrors({});
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark">
      <div className="relative bg-gradient-to-b from-dark to-[#0A0503] py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 text-gold/10 text-8xl">✉</div>
          <div className="absolute bottom-10 right-10 text-gold/10 text-8xl">🍪</div>
          <div className="absolute top-1/3 left-1/2 text-gold/10 text-6xl">✦</div>
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
            <FaCookieBite size={14} /> Let&apos;s Connect
          </motion.div>
          <h1 className="section-title text-4xl md:text-5xl lg:text-6xl font-bold mb-3">
            Get In Touch
          </h1>
          <p className="text-cream/60 text-lg max-w-xl mx-auto">
            We&apos;d love to hear from you
          </p>
        </motion.div>
      </div>

      <div ref={ref} className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-[40%] space-y-6"
          >
            <div>
              <h2 className="section-title text-3xl md:text-4xl font-bold mb-2">
                Contact Information
              </h2>
              <div className="gold-divider w-16 h-1 rounded-full mb-4" />
              <p className="text-cream/60 leading-relaxed">
                Reach out to us through any of these channels. We typically
                respond within a few hours.
              </p>
            </div>

            <div className="space-y-3">
              {contactInfo.map((item, idx) => (
                <motion.a
                  key={idx}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 * idx }}
                  className="glass-card flex items-center gap-4 rounded-xl p-4 border border-gold/20 group"
                >
                  <div className="w-11 h-11 rounded-lg bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-dark transition-all shrink-0">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-cream/60 font-medium uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p className="text-sm md:text-base text-cream font-medium">
                      {item.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="glass-card rounded-xl p-5 border border-gold/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                  <FaClock size={18} />
                </div>
                <h3 className="text-lg font-semibold text-cream">
                  Business Hours
                </h3>
              </div>
              <div className="space-y-2">
                {businessHours.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-sm border-b border-gold/10 pb-2 last:border-0 last:pb-0"
                  >
                    <span className="text-cream/60">{item.day}</span>
                    <span className="text-cream font-medium">{item.hours}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-[60%]"
          >
            <div className="glass-card rounded-2xl border border-gold/20 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                  <FaPaperPlane size={16} />
                </div>
                <h2 className="text-2xl font-bold text-cream">
                  Send Us a Message
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-cream mb-1.5">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Your name"
                      className={`input-field w-full px-4 py-3 border rounded-xl text-sm placeholder:text-cream/30 focus:outline-none transition-colors ${
                        errors.name
                          ? "border-red-400 focus:border-red-500"
                          : "border-gold/20 focus:border-gold"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cream mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="your@email.com"
                      className={`input-field w-full px-4 py-3 border rounded-xl text-sm placeholder:text-cream/30 focus:outline-none transition-colors ${
                        errors.email
                          ? "border-red-400 focus:border-red-500"
                          : "border-gold/20 focus:border-gold"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-cream mb-1.5">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+91 98765 43210"
                      className={`input-field w-full px-4 py-3 border rounded-xl text-sm placeholder:text-cream/30 focus:outline-none transition-colors ${
                        errors.phone
                          ? "border-red-400 focus:border-red-500"
                          : "border-gold/20 focus:border-gold"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cream mb-1.5">
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      placeholder="How can we help?"
                      className={`input-field w-full px-4 py-3 border rounded-xl text-sm placeholder:text-cream/30 focus:outline-none transition-colors ${
                        errors.subject
                          ? "border-red-400 focus:border-red-500"
                          : "border-gold/20 focus:border-gold"
                      }`}
                    />
                    {errors.subject && (
                      <p className="text-xs text-red-500 mt-1">{errors.subject}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-cream mb-1.5">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Tell us more about your query..."
                    className={`input-field w-full px-4 py-3 border rounded-xl text-sm placeholder:text-cream/30 focus:outline-none transition-colors resize-none ${
                      errors.message
                        ? "border-red-400 focus:border-red-500"
                        : "border-gold/20 focus:border-gold"
                    }`}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center py-3.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <FaPaperPlane size={14} />
                      Send Message
                    </span>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      <section className="bg-dark-card py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="section-title">Visit Our Bakery</h2>
            <div className="gold-divider w-20 h-1 mx-auto rounded-full mb-4" />
            <p className="section-subtitle text-cream/60">
              Come by and taste the freshness
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden shadow-lg border border-gold/20"
          >
            <Image src="/images/general/about-story.svg" alt="Zixo Cookies bakery location" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 z-10 text-center px-6 pb-8">
              <FaMapMarkerAlt className="text-gold mx-auto mb-4" size={40} />
              <h3 className="text-2xl md:text-3xl font-bold text-cream mb-2">
                Zixo Cookies Location
              </h3>
              <p className="text-cream/60 max-w-md mx-auto mb-4">
                Our bakery is located in the heart of the city. We&apos;d love to
                welcome you for a tasting experience.
              </p>
              <div className="w-16 h-0.5 bg-gold/30 mx-auto rounded-full" />
              <p className="text-cream/40 text-sm mt-4 italic">
                Google Maps integration coming soon
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
