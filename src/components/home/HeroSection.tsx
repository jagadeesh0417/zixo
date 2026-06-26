import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative h-svh md:h-screen overflow-hidden bg-dark">
      <Image
        src="/images/banner.png"
        alt="Zixo Cookies - Freshly Baked Happiness"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
        quality={90}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-5">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center w-[180px] h-14 bg-gradient-to-r from-gold to-[#C5A028] text-dark font-semibold text-sm md:text-base rounded-full shadow-lg shadow-gold/30 hover:shadow-xl hover:shadow-gold/40 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}
