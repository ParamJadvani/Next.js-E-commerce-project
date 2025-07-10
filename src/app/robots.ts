import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/cart", "/checkout"],
        },
        sitemap:
            process.env.NEXT_PUBLIC_SITE_URL + "/sitemap.xml" ||
            "http://localhost:3000/sitemap.xml",
    };
}
