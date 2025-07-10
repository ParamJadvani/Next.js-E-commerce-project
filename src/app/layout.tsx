// /app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/navbar/Navbar";
import { openGraph } from "@/utils/openGraphMeta";
import { twitter } from "@/utils/twitterMeta";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    title: {
        default: "Ember Shop - Your Online Store",
        template: "%s | Ember Shop",
    },
    description: "Discover our curated collection of products for every need at Ember Shop.",
    generator: "Next.js",
    applicationName: "Ember Shop",
    alternates: {
        canonical: "/",
        languages: {
            "en-US": "https://localhost:3000/",
        },
    },
    robots: {
        index: true,
        follow: true,
    },
    icons: {
        icon: "/favicon.ico",
    },
    openGraph: openGraph,
    twitter: twitter,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
            <body className="antialiased">
                {" "}
                <Navbar />
                <main>{children}</main>
                <Toaster position="top-right" duration={2500} />
            </body>
        </html>
    );
}
