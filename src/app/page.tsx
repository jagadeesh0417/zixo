import HeroSection from "@/components/home/HeroSection";
import BestSellers from "@/components/home/BestSellers";
import WhyChoose from "@/components/home/WhyChoose";
import SignatureCollections from "@/components/home/SignatureCollections";
import AboutSection from "@/components/home/AboutSection";
import Testimonials from "@/components/home/Testimonials";
import InstagramFeed from "@/components/home/InstagramFeed";
import YouTubeSection from "@/components/home/YouTubeSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import FAQSection from "@/components/home/FAQSection";

export default function Home() {
  return (
    <>
      <section id="hero">
        <HeroSection />
      </section>
      <section id="best-sellers">
        <BestSellers />
      </section>
      <section id="why-choose">
        <WhyChoose />
      </section>
      <section id="collections">
        <SignatureCollections />
      </section>
      <section id="about">
        <AboutSection />
      </section>
      <section id="testimonials">
        <Testimonials />
      </section>
      <section id="instagram">
        <InstagramFeed />
      </section>
      <section id="youtube">
        <YouTubeSection />
      </section>
      <section id="newsletter">
        <NewsletterSection />
      </section>
      <section id="faq">
        <FAQSection />
      </section>
    </>
  );
}
