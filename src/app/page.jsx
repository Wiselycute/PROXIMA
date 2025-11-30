
import Navbar from "@/components/Navbar";
import LogosRow from "@/components/LogosRow";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import About from "@/components/About";
import  CTA  from '@/components/CTA';
import  Footer  from '@/components/Footer';
import Features from './../components/Features';
import Hero  from '@/components/Hero';
import DashboardPreview from "@/components/DashboardPreview";

export default function Page() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <DashboardPreview />
      <Pricing />
      <Testimonials />
      <FAQ />
      <About />
      <CTA />
      <Footer />
    </>
  );
}
