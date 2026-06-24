import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-dark">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/banner.png)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen text-center px-4 sm:px-6">
        <Link
          href="/shop"
          className="btn-primary text-base px-8 py-4 inline-flex items-center gap-2"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}
