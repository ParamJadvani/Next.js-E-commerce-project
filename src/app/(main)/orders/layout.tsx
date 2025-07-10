import { openGraph } from "@/utils/openGraphMeta";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Orders",
    description: "View your order history and track shipments.",
    alternates: {
        canonical: "/orders",
        languages: {
            "en-US": "https://localhost:3000/",
        },
    },
    robots: { index: false, follow: false },
    openGraph: {
        ...openGraph,
        title: "My Orders - Ember Shop",
        url: "/orders",
        description: "View your order history and track shipments.",
    },
};

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
    return <div className="container mx-auto px-4 py-8">{children}</div>;
}
