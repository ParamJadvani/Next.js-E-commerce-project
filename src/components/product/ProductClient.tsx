"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ProductCard from "@/components/product/ProductCard";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductType } from "@/types/product";

export default function ProductsClient({
    categories,
    products,
}: {
    categories: string[];
    products: ProductType[];
    initialCategory: string | null;
}) {
    const searchParams = useSearchParams();
    const categoryFromQuery = searchParams.get("q");
    const router = useRouter();

    const filteredProducts = categoryFromQuery
        ? products?.filter((product) => product.category === categoryFromQuery)
        : products;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Products</h1>
                <div className="flex flex-wrap gap-2">
                    <Badge
                        variant={categoryFromQuery === null ? "default" : "outline"}
                        className={`cursor-pointer transition-colors duration-200 hover:bg-blue-600 ${
                            categoryFromQuery === null ? "bg-blue-500 text-white" : ""
                        }`}
                        onClick={() => router.push("/products")}
                        role="button"
                        aria-label="Show all products"
                    >
                        All
                    </Badge>
                    {categories.map((category) => (
                        <Badge
                            key={category}
                            variant={categoryFromQuery === category ? "default" : "outline"}
                            className={`cursor-pointer transition-colors duration-200 hover:bg-blue-600 ${
                                categoryFromQuery === category ? "bg-blue-500 text-white" : ""
                            }`}
                            onClick={() =>
                                router.push(`/products?q=${encodeURIComponent(category)}`)
                            }
                            role="button"
                            aria-label={`Filter by ${category}`}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Badge>
                    ))}
                </div>
            </div>
            <Separator className="my-6" />
            <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-opacity duration-200"
                style={{ opacity: filteredProducts ? 1 : 0.5 }}
            >
                {filteredProducts?.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            
        </div>
    );
}
