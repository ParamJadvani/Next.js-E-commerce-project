// /app/(main)/products/[id]/page.tsx
import { Metadata } from "next";
import ProductDetail from "@/components/product/ProductDetail";
import { Suspense } from "react";
import ProductDetailSkeleton from "@/app/(main)/products/[id]/loading";
import Script from "next/script";
import { twitter } from "@/utils/twitterMeta";
import { openGraph } from "@/utils/openGraphMeta";
import { ProductType } from "@/types/product";

const fetchProduct = async (id: string): Promise<ProductType> => {
    if (isNaN(Number(id))) {
        throw new Error("Invalid product ID format.");
    }
    const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
        cache: "force-cache",
    });
    if (!res.ok) {
        if (res.status === 404) {
            throw new Error(`Product with ID ${id} not found.`);
        }
        console.error(`Failed to fetch product ${id}: ${res.status} ${res.statusText}`);
        throw new Error(`Failed to fetch product (status: ${res.status})`);
    }
    const product = await res.json();
    if (!product || typeof product !== "object" || !product.id || !product.title) {
        console.error("Invalid product data received:", product);
        throw new Error("Received invalid product data format.");
    }
    return product as ProductType;
};

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const productId = (await params).id;

    try {
        const product = await fetchProduct(productId);
        const pageTitle = product.title;
        const pageDescription = product.description.substring(0, 160);
        const canonicalUrl = `/products/${productId}`;
        const imageUrl = product.image;

        return {
            title: pageTitle,
            description: pageDescription,
            alternates: {
                canonical: canonicalUrl,
            },
            openGraph: {
                ...openGraph,
                title: `${product.title}`,
                description: pageDescription,
                url: canonicalUrl,
                type: "website",
                images: [
                    {
                        url: imageUrl,
                        width: 800,
                        height: 600,
                        alt: product.title,
                    },
                ],
            },
            twitter: {
                ...twitter,
                card: "summary_large_image",
                title: `${product.title} - Ember Shop`,
                description: pageDescription,
                images: [imageUrl],
            },
        };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Product data unavailable.";
        console.error(`Error generating metadata for product ${productId}:`, errorMessage);
        const title = "Product Not Found";
        const description = `Details for product ID ${productId} could not be loaded. ${errorMessage}`;
        return {
            title,
            description: description,
            alternates: {
                canonical: `/products/${productId}`,
            },
            robots: {
                index: false,
            },
            openGraph: {
                ...openGraph,
                title: `${title} - Ember Shop`,
                description,
                url: `/products/${productId}`,
            },
            twitter: {
                ...twitter,
                card: "summary",
                title: `${title} - Ember Shop`,
                description,
            },
        };
    }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const productId = (await params).id;

    try {
        const product = await fetchProduct(productId);

        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            image: product.image,
            description: product.description,
            sku: product.id.toString(),
            offers: {
                "@type": "Offer",
                url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/products/${
                    product.id
                }`,
                priceCurrency: "USD",
                price: product.price.toFixed(2),
                availability: "https://schema.org/InStock",
                priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                    .toISOString()
                    .split("T")[0],
            },
        };

        return (
            <>
                <Script
                    id="structured-data"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
                <Suspense fallback={<ProductDetailSkeleton />}>
                    <ProductDetail productData={product} />
                </Suspense>
            </>
        );
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        console.error(`Error rendering ProductDetailPage for ID ${productId}:`, errorMessage);
        throw error;
    }
}
