// /app/(main)/layout.tsx
import { openGraph } from "@/utils/openGraphMeta";
import { twitter } from "@/utils/twitterMeta";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    description: "Manage your account, view orders, checkout, and browse products at Ember Shop.",
    openGraph: {
        ...openGraph,
        title: "Manage Your Ember Shop Account",
        description: "Access your profile, orders, cart, and checkout.",
    },
    twitter: {
        ...twitter,
        title: "Manage Your Ember Shop Account",
        description: "Access your profile, orders, cart, and checkout.",
    },
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return <div className="min-h-screen bg-background">{children}</div>;
}
