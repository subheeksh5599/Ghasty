import { FAQ } from "@/components/faq";
import { Features } from "@/components/features";
import { FinalCTA } from "@/components/final-cta";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/config";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: `${siteConfig.name} - ${siteConfig.tagline}`,
  description: siteConfig.description,
  path: "/",
});

export default function HomePage(): ReactNode {
  return (
    <main id="main-content" className="flex-1">
      <Hero />
      <HowItWorks />
      <Features />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
