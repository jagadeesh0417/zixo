import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="hero-root relative w-full min-h-svh bg-dark overflow-hidden">
      <picture>
        <source
          media="(max-width: 768px)"
          srcSet="/images/banner.png"
        />
        <img
          src="/images/banner.png"
          alt="Zixo Cookies - Freshly Baked Happiness"
          className="hero-image absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
        />
      </picture>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />

      <div className="hero-content absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
        <Link
          href="/shop"
          className="hero-cta inline-flex items-center justify-center w-[180px] h-[54px] md:w-[220px] md:h-[60px] bg-gradient-to-r from-gold to-[#C5A028] text-dark font-semibold text-sm md:text-base rounded-full shadow-lg shadow-gold/30 hover:shadow-xl hover:shadow-gold/40 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}
