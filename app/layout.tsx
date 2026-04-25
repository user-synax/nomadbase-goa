import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import BackToTop from "@/components/BackToTop";

const geistHeading = Geist({subsets:['latin'],variable:'--font-heading'});

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nomadbase-goa.vercel.app'),
  title: {
    default: 'NomadBase Goa — Work From Paradise',
    template: '%s | NomadBase Goa'
  },
  description: 'The definitive hub for digital nomads in Goa. Find co-working spaces, colivings, and a community that gets it.',
  keywords: ['digital nomad goa', 'coworking goa', 'coliving goa', 'remote work goa', 'nomad goa', 'digital nomad india', 'work from goa', 'goa workspaces'],
  authors: [{ name: 'NomadBase Goa' }],
  creator: 'NomadBase Goa',
  publisher: 'NomadBase Goa',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'NomadBase Goa',
    title: 'NomadBase Goa — Work From Paradise',
    description: 'The definitive hub for digital nomads in Goa. Find co-working spaces, colivings, and a community that gets it.',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'NomadBase Goa - Work From Paradise',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@nomadbasegoa',
    creator: '@nomadbasegoa',
    title: 'NomadBase Goa — Work From Paradise',
    description: 'The definitive hub for digital nomads in Goa. Find co-working spaces, colivings, and a community that gets it.',
    images: ['/og-default.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-icon.png',
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", geist.variable, geistHeading.variable)}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
        <Toaster position="bottom-center" richColors />
        <BackToTop />
      </body>
    </html>
  );
}
