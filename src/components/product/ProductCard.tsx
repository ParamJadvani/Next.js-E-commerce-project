"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { addToCart } from "@/actions/cart/cart";
import userStore from "@/store/userStore";
import { ProductType } from "@/types/product";
import userCartStore from "@/store/userCartStore";

interface ProductCardProps {
    product: ProductType;
}

export default function ProductCard({ product }: ProductCardProps) {
    const user = userStore((s) => s.user);
    const addToCartStore = userCartStore((s) => s.addToCart);
    const [isPending, startTransition] = useTransition();

    const handleAdd = () => {
        if (!user) {
            toast.error("Please log in to add items");
            return;
        }

        startTransition(async () => {
            const result = await addToCart(user.id, product.id, 1, product.price);
            if (result.error) {
                toast.error(result.error);
                return;
            }
            if (result.item) {
                addToCartStore({ ...result.item, product });
            }
            if (result.success) {
                toast.success("Added to cart!");
            } else {
                toast.error(result.error);
            }
        });
    };

    return (
        <Card className="overflow-hidden h-full flex flex-col">
            <div className="relative h-52 flex items-center justify-center aspect-square">
                <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-contain absolute"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
            </div>

            <CardHeader>
                <Link href={`/products/${product.id}`}>
                    <CardTitle className="text-base line-clamp-2 h-12 hover:text-blue-600 transition-colors duration-200">
                        {product.title}
                    </CardTitle>
                </Link>
            </CardHeader>

            <CardContent className="pb-2 flex-grow">
                <Badge variant="outline" className="mb-2">
                    {product.category}
                </Badge>
                <p className="font-semibold text-lg">${product.price.toFixed(2)}</p>
            </CardContent>

            <CardFooter>
                <div className="w-full grid grid-cols-2 gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/products/${product.id}`}>View Details</Link>
                    </Button>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700"
                        size="sm"
                        onClick={handleAdd}
                        disabled={isPending}
                    >
                        <ShoppingCart size={16} className="mr-1" />
                        {isPending ? "Adding..." : "Add"}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
