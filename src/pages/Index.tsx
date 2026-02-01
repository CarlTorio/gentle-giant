import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServicesGrid from "@/components/ServicesGrid";
import OurStory from "@/components/OurStory";
import ProductsSection from "@/components/ProductsSection";
import MembershipSection from "@/components/MembershipSection";
import Testimonials from "@/components/Testimonials";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FloatingBookButton from "@/components/FloatingBookButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <ServicesGrid />
        <OurStory />
        <ProductsSection />
        <MembershipSection />
        <Testimonials />
        <ContactSection />
      </main>
      <Footer />
      <FloatingBookButton />
    </div>
  );
};

export default Index;
