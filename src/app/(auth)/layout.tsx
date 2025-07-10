// /app/(auth)/layout.tsx
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    description: "Access or create your Ember Shop account.",
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        title: "Account Access - Ember Shop",
        description: "Log in or sign up for your Ember Shop account.",
    },
    twitter: {
        title: "Account Access - Ember Shop",
        description: "Log in or sign up for your Ember Shop account.",
    },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            {children}
        </div>
    );
}
