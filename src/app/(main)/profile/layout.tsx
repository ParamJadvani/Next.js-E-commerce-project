import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Your Profile",
    description: "View and manage your Ember Shop account details.",
    alternates: {
        canonical: "/profile",
        languages: {
            "en-US": "https://localhost:3000/",
        },
    },
    robots: { index: false, follow: false },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return <div className="container mx-auto px-4 py-8">{children}</div>;
}
