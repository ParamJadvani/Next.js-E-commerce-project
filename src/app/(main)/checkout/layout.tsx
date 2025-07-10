import { openGraph } from "@/utils/openGraphMeta";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Checkout",
    description: "Complete your purchase securely at Ember Shop.",
    alternates: {
        canonical: "/checkout",
        languages: {
            "en-US": "https://localhost:3000/",
        },
    },
    robots: { index: false, follow: false },
    openGraph: {
        ...openGraph,
        title: "Checkout - Ember Shop",
        url: "/checkout",
        description: "Complete your purchase securely at Ember Shop.",
    },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
    return <div className="container mx-auto px-4 py-8">{children}</div>;
}
