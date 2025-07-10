// /app/(main)/cart/page.tsx
"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash, Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";
import userCartStore from "@/store/userCartStore";
import { fetchCartData } from "@/helper/helper";
import { removeFromCart, updateCartQuantity } from "@/actions/cart/cart";
import { toast } from "sonner";
import CartLoadingSkeleton from "@/app/(main)/cart/loading";

export default function CartPage() {
    const router = useRouter();
    const {
        cart,
        updateCart: updateCartInStore,
        removeFromCart: removeFromCartStore,
        setCart,
    } = userCartStore((s) => s);
    const [isLoading, setIsLoading] = React.useState(true);

    useEffect(() => {
        async function loadCart() {
            setIsLoading(true);
            try {
                await fetchCartData();
            } catch (error) {
                console.error("Failed to load cart data:", error);
                toast.error("Error", { description: "Could not load your cart. Please refresh." });
            } finally {
                setIsLoading(false);
            }
        }
        loadCart();
    }, [setCart]);

    const debouncedUpdateQuantity = useMemo(() => {
        let timeoutId: NodeJS.Timeout | null = null;
        return (cartId: string, newQuantity: number) => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(async () => {
                try {
                    await updateCartQuantity(cartId, newQuantity);
                } catch (error) {
                    console.error("Failed to update quantity:", error);
                    toast.error("Update Failed", {
                        description: "Could not update item quantity.",
                    });
                    await fetchCartData();
                }
            }, 500);
        };
    }, []);

    const handleQuantityChange = async (cartId: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        const item = cart.find((i) => i._id === cartId);
        if (!item || !item.product) return;

        const updatedItemData = {
            ...item,
            quantity: newQuantity,
            total: newQuantity * item.price,
        };
        updateCartInStore(updatedItemData);
        debouncedUpdateQuantity(cartId, newQuantity);
    };

    const handleRemove = async (cartId: string, productName?: string) => {
        removeFromCartStore(cartId);
        toast.info(`Removed ${productName || "item"} from cart.`);

        try {
            await removeFromCart(cartId);
        } catch (error) {
            console.error("Failed to remove item:", error);
            toast.error("Removal Failed", { description: "Could not remove item from cart." });
            await fetchCartData();
        }
    };

    const { subtotal, shipping, tax, total } = useMemo(() => {
        const calculatedSubtotal = cart.reduce((sum, item) => sum + item.total, 0);
        const calculatedShipping =
            calculatedSubtotal > 0 ? (calculatedSubtotal > 50 ? 0 : 5.99) : 0;
        const calculatedTax = calculatedSubtotal * 0.07;
        const calculatedTotal = calculatedSubtotal + calculatedShipping + calculatedTax;
        return {
            subtotal: calculatedSubtotal,
            shipping: calculatedShipping,
            tax: calculatedTax,
            total: calculatedTotal,
        };
    }, [cart]);

    if (isLoading) {
        return <CartLoadingSkeleton />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Button
                    variant="outline"
                    className="text-blue-600 border-blue-600 hover:bg-blue-50 flex items-center"
                    onClick={() => router.push("/products")}
                >
                    <ArrowLeft size={18} className="mr-2" />
                    Continue Shopping
                </Button>
            </div>

            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            {cart.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2">
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle>Your Items ({cart.length})</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 divide-y divide-gray-200">
                                {cart.map((item) => (
                                    <div
                                        key={item._id}
                                        className="p-4 flex flex-col sm:flex-row items-start gap-4"
                                    >
                                        <div className="h-24 w-24 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center p-1 border">
                                            {item.product?.image ? (
                                                <Image
                                                    src={item.product.image}
                                                    alt={item.product.title || "Product image"}
                                                    width={80}
                                                    height={80}
                                                    className="object-contain mix-blend-multiply"
                                                    onError={(e) =>
                                                        (e.currentTarget.src =
                                                            "https://placehold.co/80x80/eee/ccc?text=N/A")
                                                    }
                                                />
                                            ) : (
                                                <ShoppingBag size={32} className="text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-grow space-y-2">
                                            <Link
                                                href={`/products/${item.productId}`}
                                                className="font-medium hover:text-blue-600 transition-colors line-clamp-2"
                                            >
                                                {item.product?.title || "Product Title Unavailable"}
                                            </Link>
                                            <div className="font-bold text-lg">
                                                ${item.price.toFixed(2)}
                                            </div>
                                            <div className="flex items-center justify-between pt-1">
                                                <div className="flex items-center border rounded-md overflow-hidden">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-none border-r disabled:opacity-50"
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                item._id,
                                                                item.quantity - 1
                                                            )
                                                        }
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={14} />
                                                    </Button>
                                                    <span className="w-10 text-center text-sm font-medium">
                                                        {item.quantity}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-none border-l"
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                item._id,
                                                                item.quantity + 1
                                                            )
                                                        }
                                                    >
                                                        <Plus size={14} />
                                                    </Button>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() =>
                                                        handleRemove(item._id, item.product?.title)
                                                    }
                                                    title="Remove item"
                                                >
                                                    <Trash size={18} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1 sticky top-24">
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span>
                                            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Estimated Tax (7%)</span>
                                        <span>${tax.toFixed(2)}</span>
                                    </div>
                                    <Separator className="my-3" />
                                    <div className="flex justify-between font-bold text-lg text-gray-800">
                                        <span>Order Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                    size="lg"
                                    onClick={() => router.push("/checkout")}
                                    disabled={cart.length === 0}
                                >
                                    <ShoppingBag size={18} className="mr-2" />
                                    Proceed to Checkout
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            ) : (
                <Card className="text-center py-16 shadow-sm">
                    <CardContent>
                        <div className="flex flex-col items-center justify-center space-y-5">
                            <ShoppingCart size={64} className="text-gray-400" />
                            <h2 className="text-2xl font-semibold text-gray-700">
                                Your cart is empty
                            </h2>
                            <p className="text-gray-500 max-w-sm mx-auto">
                                Looks like you haven&apos;t added anything yet. Let&apos;s find
                                something great!
                            </p>
                            <Button asChild size="lg" className="mt-4">
                                <Link href="/products">Start Shopping</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
