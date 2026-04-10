import { getAllSiteData } from "@/lib/queries";
import {
  Navbar,
  Hero,
  Marquee,
  About,
  Gallery,
  Programs,
  Process,
  Testimonials,
  CTA,
  ContactForm,
  Footer,
} from "@/components/site";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function HomePage() {
  const { content, gallery, testimonials, plans, stats, marquee } =
    await getAllSiteData();

  return (
    <main className="bg-bg text-foreground min-h-screen">
      <Navbar />
      <Hero content={content} stats={stats} />
      <Marquee items={marquee} />
      <About content={content} />
      <Gallery images={gallery} />
      <Programs content={content} plans={plans} />
      <Process content={content} />
      <Testimonials testimonials={testimonials} />
      <CTA content={content} />
      <ContactForm plans={plans} />
      <Footer content={content} />
    </main>
  );
}
