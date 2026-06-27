import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-dark overflow-hidden">
      <div className="relative w-full min-h-screen hidden md:block">
        <picture>
          <img
            src="/images/banner.png"
            alt="Zixo Cookies"
            className="absolute inset-0 w-full h-full object-cover object-center"
            fetchPriority="high"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center w-[220px] h-[60px] bg-gradient-to-r from-gold to-[#C5A028] text-dark font-semibold text-base rounded-full shadow-lg shadow-gold/30 hover:shadow-xl hover:shadow-gold/40 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Shop Now
          </Link>
        </div>
      </div>

      <div className="relative w-full min-h-svh md:hidden flex flex-col bg-dark">
        <div className="relative flex-1 flex items-center justify-center px-4">
          <img
            src="/images/banner.png"
            alt="Zixo Cookies"
            className="w-full h-auto max-h-[70vh] object-contain object-center"
            fetchPriority="high"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
        <div className="relative z-10 flex items-center justify-center pb-8 pt-4">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center w-[180px] h-[54px] bg-gradient-to-r from-gold to-[#C5A028] text-dark font-semibold text-sm rounded-full shadow-lg shadow-gold/30 active:scale-95 transition-all duration-300"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}
