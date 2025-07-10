// /app/(auth)/signup/layout.tsx
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Sign Up",
    description: "Create a new Ember Shop account to start shopping and enjoy exclusive benefits.",
    alternates: {
        canonical: "/signup",
    },
    openGraph: {
        title: "Sign Up - Ember Shop",
        description: "Join Ember Shop and start your shopping journey.",
        url: "/signup",
    },
    twitter: {
        title: "Sign Up - Ember Shop",
        description: "Create a new Ember Shop account.",
    },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
