import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-[70vh] md:min-h-screen overflow-hidden bg-dark">
      <Image
        src="/images/banner.png"
        alt="Zixo Cookies"
        fill
        priority
        className="object-cover object-center md:object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />

      <div className="relative z-20 flex flex-col items-center justify-center min-h-[70vh] md:min-h-screen text-center px-6 sm:px-8">
        <Link
          href="/shop"
          className="btn-primary text-sm md:text-base px-8 py-3.5 md:px-10 md:py-4 inline-flex items-center gap-2 shadow-lg shadow-gold/25"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}
