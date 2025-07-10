// /app/(auth)/login/layout.tsx
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Login",
    description: "Log in to your Ember Shop account to access your profile, orders, and cart.",
    alternates: {
        canonical: "/login",
    },
    openGraph: {
        title: "Login - Ember Shop",
        description: "Access your Ember Shop account.",
        url: "/login",
    },
    twitter: {
        title: "Login - Ember Shop",
        description: "Log in to your Ember Shop account.",
    },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
