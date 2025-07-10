"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, CreditCard, Check } from "lucide-react";
import userCartStore from "@/store/userCartStore";
import userStore from "@/store/userStore";
import { createOrder } from "@/actions/order/order";
import { toast } from "sonner";
import userOrderStore from "@/store/userOrderStore";
import { PaymentInfo, ShippingAddress } from "@/types/order";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import ShippingForm from "@/components/checkout/ShippingForm";
import PaymentForm from "@/components/checkout/PaymentForm";
import ReviewOrder from "@/components/checkout/ReviewOrder";
import OrderSummary from "@/components/checkout/OrderSummary";

const initialShippingAddress: ShippingAddress = {
    fullName: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phoneNumber: "",
};
const initialPaymentInfo: PaymentInfo = {
    cardNumber: "",
    nameOnCard: "",
    expiryDate: "",
    cvv: "",
};

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, clearCart } = userCartStore((s) => s);
    const addOrderInStore = userOrderStore((s) => s.addOrder);
    const { user } = userStore((s) => s);
    const [activeTab, setActiveTab] = useState("shipping");
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(initialShippingAddress);
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>(initialPaymentInfo);

    const handleShippingChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingAddress((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handlePaymentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === "cardNumber") {
            const digitsOnly = value.replace(/\D/g, "");
            formattedValue = digitsOnly
                .replace(/(\d{4})(?=\d)/g, "$1 ")
                .trim()
                .substring(0, 19);
        } else if (name === "expiryDate") {
            const digitsOnly = value.replace(/\D/g, "");
            formattedValue =
                digitsOnly.length > 2
                    ? `${digitsOnly.substring(0, 2)}/${digitsOnly.substring(2, 4)}`
                    : digitsOnly;
        } else if (name === "cvv") {
            formattedValue = value.replace(/\D/g, "").substring(0, 4);
        }

        setPaymentInfo((prev) => ({ ...prev, [name]: formattedValue }));
    }, []);

    const isShippingComplete = useMemo(
        () => Object.values(shippingAddress).every((value) => value.trim() !== ""),
        [shippingAddress]
    );

    const isPaymentComplete = useMemo(
        () =>
            paymentInfo.cardNumber.replace(/\s/g, "").length === 16 &&
            paymentInfo.nameOnCard.trim() !== "" &&
            /^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate) &&
            paymentInfo.cvv.length >= 3,
        [paymentInfo]
    );

    const handleNextStep = useCallback(() => {
        if (activeTab === "shipping" && isShippingComplete) setActiveTab("payment");
        else if (activeTab === "payment" && isPaymentComplete) setActiveTab("review");
    }, [activeTab, isShippingComplete, isPaymentComplete]);

    const handlePrevStep = useCallback(() => {
        if (activeTab === "payment") setActiveTab("shipping");
        else if (activeTab === "review") setActiveTab("payment");
    }, [activeTab]);

    const handlePlaceOrder = async () => {
        if (!user) {
            toast.error("Authentication Error", {
                description: "Please log in to place an order.",
            });
            router.push("/login?redirect=/checkout");
            return;
        }
        if (!isShippingComplete || !isPaymentComplete) {
            toast.warning("Incomplete Information", {
                description: "Please complete all shipping and payment details.",
            });

            if (!isShippingComplete) setActiveTab("shipping");
            else if (!isPaymentComplete) setActiveTab("payment");
            return;
        }
        if (cart.length === 0) {
            toast.warning("Empty Cart", {
                description: "Your cart is empty. Please add items before checking out.",
            });
            router.push("/products");
            return;
        }

        const items = cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
        }));

        const calculatedTotal = total;

        try {
            const result = await createOrder({
                items,
                user: user.id,
                shippingAddress,
                paymentInfo,
                total: calculatedTotal,
                status: "pending",
            });

            console.log("order", result);

            if (result.success && result.order) {
                clearCart();
                addOrderInStore({
                    ...result.order,
                    items,
                });

                router.push(`/orders/${result.order._id}`);
                toast.success("Order Placed!", {
                    description: `Your order #${result.order._id} has been confirmed.`,
                });
            } else {
                toast.error("Order Failed", {
                    description: result.error || "Could not place your order. Please try again.",
                });
            }
        } catch (error: unknown) {
            console.error("Checkout Error:", error);
            const message =
                error instanceof Error ? error.message : "An unexpected error occurred.";
            toast.error("Order Failed", { description: message });
        } finally {
            setIsPlacingOrder(false);
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

    if (cart.length === 0 && !isPlacingOrder) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">Checkout</h1>
                <p className="text-gray-600 mb-6">
                    Your cart is empty. Add some products to proceed.
                </p>
                <Button asChild>
                    <Link href="/products">Go Shopping</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <CheckoutHeader onBackToCart={() => router.push("/cart")} />
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-6">
                            <TabsTrigger
                                value="shipping"
                                disabled={activeTab !== "shipping" && !isShippingComplete}
                            >
                                <Home size={16} className="mr-2" />
                                Shipping
                            </TabsTrigger>
                            <TabsTrigger
                                value="payment"
                                disabled={
                                    !isShippingComplete ||
                                    (activeTab === "review" && !isPaymentComplete)
                                }
                            >
                                <CreditCard size={16} className="mr-2" />
                                Payment
                            </TabsTrigger>
                            <TabsTrigger
                                value="review"
                                disabled={!isShippingComplete || !isPaymentComplete}
                            >
                                <Check size={16} className="mr-2" />
                                Review
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="shipping">
                            <ShippingForm
                                shippingAddress={shippingAddress}
                                onShippingChange={handleShippingChange}
                                onNextStep={handleNextStep}
                                isShippingComplete={isShippingComplete}
                            />
                        </TabsContent>

                        <TabsContent value="payment">
                            <PaymentForm
                                paymentInfo={paymentInfo}
                                onPaymentChange={handlePaymentChange}
                                onNextStep={handleNextStep}
                                onPrevStep={handlePrevStep}
                                isPaymentComplete={isPaymentComplete}
                            />
                        </TabsContent>

                        <TabsContent value="review">
                            <ReviewOrder
                                shippingAddress={shippingAddress}
                                paymentInfo={paymentInfo}
                                cart={cart}
                                onPrevStep={handlePrevStep}
                                onPlaceOrder={handlePlaceOrder}
                                onEditShipping={() => setActiveTab("shipping")}
                                onEditPayment={() => setActiveTab("payment")}
                                isPlacingOrder={isPlacingOrder}
                                total={total}
                            />
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="lg:col-span-1 sticky top-24">
                    <OrderSummary
                        subtotal={subtotal}
                        shipping={shipping}
                        tax={tax}
                        total={total}
                        cartLength={cart.length}
                    />
                </div>
            </div>
        </div>
    );
}
