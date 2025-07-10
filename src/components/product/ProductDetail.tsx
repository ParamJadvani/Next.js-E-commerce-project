"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ShoppingCart, Star } from "lucide-react";
import QuantitySelector from "@/components/product/QuantitySelector";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addToCart } from "@/actions/cart/cart";
import userStore from "@/store/userStore";

interface ProductDetailProps {
    productData: {
        id: string;
        title: string;
        category: string;
        rating: {
            rate: number;
            count: number;
        };
        price: number;
        image: string;
        description: string;
    };
}

export default function ProductDetail({ productData }: ProductDetailProps) {
    const user = userStore((s) => s.user);
    const [quantity, setQuantity] = useState(1);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleAddToCart = async () => {
        if (!user) {
            toast.error("Log in first to add items to your cart");
            return;
        }

        startTransition(async () => {
            const result = await addToCart(user.id, productData.id, quantity, productData.price);
            if (result.success) {
                toast.success("Added to cart");
                router.push("/cart");
            } else {
                toast.error(result.error);
            }
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Button
                variant="outline"
                className="text-blue-600 border-blue-600 hover:bg-blue-50 mb-6"
                onClick={() => router.push("/products")}
            >
                <ArrowLeft size={18} className="mr-2" />
                Back to Products
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="overflow-hidden p-0">
                    <div className="bg-muted h-96 flex items-center justify-center p-8">
                        <Image
                            src={productData.image}
                            alt={productData.title}
                            className="h-full object-contain"
                            height={200}
                            width={200}
                        />
                    </div>
                </Card>

                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold">{productData.title}</h1>
                        <div className="flex items-center mt-2 space-x-2">
                            <Badge variant="outline">{productData.category}</Badge>
                            {productData.rating && (
                                <div className="flex items-center text-yellow-500">
                                    <Star size={16} className="fill-yellow-500" />
                                    <span className="ml-1 text-sm font-medium">
                                        {productData.rating.rate}
                                    </span>
                                    <span className="text-sm text-muted-foreground ml-1">
                                        ({productData.rating.count} reviews)
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-3xl font-bold text-blue-600">
                        ${productData.price.toFixed(2)}
                    </div>

                    <Separator />

                    <CardContent className="p-0">
                        <p className="text-muted-foreground">{productData.description}</p>
                    </CardContent>

                    <div className="space-y-4">
                        <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            size="lg"
                            onClick={handleAddToCart}
                            disabled={isPending}
                        >
                            <ShoppingCart size={18} className="mr-2" />
                            {isPending ? "Adding..." : "Add to Cart"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
