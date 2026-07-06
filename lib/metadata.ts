import { siteConfig } from "@/lib/config";
import type { Metadata } from "next";

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "BOT Chain",
    "gasless transactions",
    "EOA paymaster",
    "gas abstraction",
    "Ghasty",
    "gasless dApp",
    "blockchain",
    "DePIN",
    "AI agent",
    "EVM",
  ],
  authors: [{ name: "Ghasty Protocol" }],
  creator: "Ghasty Protocol",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    creator: siteConfig.social.twitter,
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface CreateMetadataParams {
  title: string;
  description: string;
  path: string;
}

export function createMetadata({ title, description, path }: CreateMetadataParams): Metadata {
  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}${path}` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}${path}`,
    },
    twitter: {
      title,
      description,
    },
  };
}
