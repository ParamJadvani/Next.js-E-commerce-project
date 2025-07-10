// /app/(main)/products/page.tsx
import ProductsClient from "@/components/product/ProductClient";
import { Metadata } from "next";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import ProductsPageSkeleton from "@/app/(main)/products/loading";
import { ProductType } from "@/types/product";
import { openGraph } from "@/utils/openGraphMeta";
import { twitter } from "@/utils/twitterMeta";
// import { openGraph } from "@/utils/openGraphMeta";

export const dynamic = "force-dynamic";

const fetchCategories = async (): Promise<string[]> => {
    try {
        const res = await fetch("https://fakestoreapi.com/products/categories");
        if (!res.ok) throw new Error(`Failed to fetch categories (status: ${res.status})`);
        const data = await res.json();
        if (!Array.isArray(data)) {
            throw new Error("Received invalid category data format.");
        }
        return data as string[];
    } catch (error) {
        if (error instanceof Error) console.error("Error fetching categories:", error.message);
        else console.error("Error fetching categories:", error);
        return [];
    }
};

const fetchProducts = async (): Promise<ProductType[]> => {
    try {
        const res = await fetch(`https://fakestoreapi.com/products`);
        if (!res.ok) throw new Error(`Failed to fetch products (status: ${res.status})`);
        const data = await res.json();
        return data;
    } catch (error) {
        if (error instanceof Error) console.error("Error fetching products:", error.message);
        else console.error("Error fetching products:", error);
        return [];
    }
};

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
    const category = (await searchParams).q;
    let title = "All Products - Ember Shop";
    let description = "Browse our full catalog of quality products at Ember Shop.";
    const canonical = category ? `/products?q=${encodeURIComponent(category)}` : "/products";

    try {
        const categories = await fetchCategories();
        if (category && categories.includes(category)) {
            const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
            title = `${formattedCategory} - Products | Ember Shop`;
            description = `Explore our collection of ${formattedCategory.toLowerCase()} products at Ember Shop.`;
        } else if (category) {
            title = "Invalid Category - Products | Ember Shop";
            description = `The category "${category}" was not found. Browse all products instead.`;
        }
    } catch (error: unknown) {
        console.error("Error generating metadata:", error);
        title = "Products - Ember Shop";
        description = "Error loading categories. Browse our products at Ember Shop.";
    }

    return {
        title,
        description,
        alternates: {
            canonical,
            languages: {
                "en-US": "https://localhost:3000/",
            },
        },
        openGraph: {
            ...openGraph,
            title: title.replace(" | Ember Shop", ""),
            description,
            url: canonical,
        },
        twitter: {
            ...twitter,
            title: title.replace(" | Ember Shop", ""),
            description,
        },
    };
}

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const initialCategory = (await searchParams).q || null;
    let categories: string[] = [];
    let products: ProductType[] = [];
    let fetchError: string | null = null;

    try {
        categories = await fetchCategories();
        products = await fetchProducts();
    } catch (error: unknown) {
        fetchError =
            error instanceof Error
                ? error.message
                : "An unknown error occurred while fetching categories.";
        console.error("ProductsPage fetch error:", fetchError);
    }

    if (fetchError && categories.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Products</h1>
                <p className="text-gray-600 mb-2">
                    We couldn&apos;t load the product categories at this time.
                </p>
                <p className="text-sm text-red-500 mb-6">Details: {fetchError}</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
        );
    }

    return (
        <Suspense fallback={<ProductsPageSkeleton />}>
            <ProductsClient
                categories={categories}
                initialCategory={initialCategory}
                products={products}
            />
        </Suspense>
    );
}
