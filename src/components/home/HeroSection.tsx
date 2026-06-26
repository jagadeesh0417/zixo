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
        className="object-cover object-[center_30%] md:object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

      <div className="relative z-20 flex flex-col items-center justify-center min-h-[70vh] md:min-h-screen text-center px-4 sm:px-6">
        <Link
          href="/shop"
          className="btn-primary text-sm md:text-base px-6 py-3 md:px-8 md:py-4 inline-flex items-center gap-2"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}
