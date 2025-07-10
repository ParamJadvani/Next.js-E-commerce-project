import { openGraph } from "@/utils/openGraphMeta";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shopping Cart",
    description: "Review items in your shopping cart and proceed to checkout.",
    alternates: {
        canonical: "/cart",
        languages: {
            "en-US": "https://localhost:3000/",
        },
    },
    openGraph: {
        ...openGraph,
        title: "Shopping Cart - Ember Shop",
        url: "/cart",
    },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
    return <div className="container mx-auto px-4 py-8">{children}</div>;
}
