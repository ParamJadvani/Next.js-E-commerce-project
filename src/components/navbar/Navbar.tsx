"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingCart, Home, Package, LogOut } from "lucide-react";
import { toast } from "sonner";
import { logoutAction } from "@/actions/auth/auth";
import userStore from "@/store/userStore";
import userCartStore from "@/store/userCartStore";
import userOrderStore from "@/store/userOrderStore";
import { fetchUserData, fetchCartData, fetchOrdersData } from "@/helper/helper";

export default function Navbar() {
    const router = useRouter();
    const { user, logout, isLoggedIn } = userStore((s) => s);
    const cartItems = new Set(userCartStore((s) => s.cart));
    const orders = userOrderStore((s) => s.orders);
    const pathname = usePathname();

    const [isLoading, setIsLoading] = useState(true);

    const hiddenRoutes = ["/login", "/signup"];

    const logoutHandler = async () => {
        try {
            toast.promise(
                (async () => {
                    const result = await logoutAction();
                    if (result.error) throw new Error(result.error);
                    return result;
                })(),
                {
                    loading: "Logging out...",
                    success: "Logged out successfully!",
                    error: (err) => err.message,
                }
            );
            logout();
            router.push("/login");
        } catch (error: unknown) {
            if (error instanceof Error)
                toast("Error", {
                    description: error.message || "Something went wrong",
                });
        }
    };

    const getAvatarLetter = () => {
        return user?.username?.charAt(0).toUpperCase() || "?";
    };

    useEffect(() => {
        async function initializeData() {
            setIsLoading(true);
            try {
                await fetchUserData();
                await fetchCartData();
                await fetchOrdersData();
            } catch (err) {
                console.error("Error initializing data:", err);
            } finally {
                setIsLoading(false);
            }
        }
        initializeData();
    }, []);

    if (hiddenRoutes.includes(pathname) || isLoading) {
        return null;
    }

    return (
        <nav className="bg-background border-b border-border sticky top-0 z-10">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Link href="/" className="text-xl font-bold text-blue-600">
                            Ember
                        </Link>
                    </div>

                    <div className="flex items-center space-x-6">
                        <Link
                            href="/"
                            className={`flex items-center space-x-1 ${
                                pathname === "/"
                                    ? "text-blue-600 font-medium"
                                    : "text-foreground hover:text-blue-500 transition-colors"
                            }`}
                        >
                            <Home size={18} />
                            <span>Home</span>
                        </Link>

                        <Link
                            href="/products"
                            className={`flex items-center space-x-1 ${
                                pathname.includes("/products")
                                    ? "text-blue-600 font-medium"
                                    : "text-foreground hover:text-blue-500 transition-colors"
                            }`}
                        >
                            <Package size={18} />
                            <span>Products</span>
                        </Link>

                        <Link
                            href="/cart"
                            className={`flex items-center space-x-1 ${
                                pathname === "/cart"
                                    ? "text-blue-600 font-medium"
                                    : "text-foreground hover:text-blue-500 transition-colors"
                            }`}
                        >
                            <div className="relative">
                                <ShoppingCart size={18} />
                                {cartItems.size > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                        {cartItems.size}
                                    </span>
                                )}
                            </div>
                            <span>Cart</span>
                        </Link>

                        {orders.length > 0 && (
                            <Link
                                href="/orders"
                                className={`flex items-center space-x-1 ${
                                    pathname === "/orders"
                                        ? "text-blue-600 font-medium"
                                        : "text-foreground hover:text-blue-500 transition-colors"
                                }`}
                            >
                                <Package size={18} />
                                <span>Orders</span>
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        {isLoggedIn ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full bg-blue-600 text-white hover:bg-blue-700 h-8 w-8"
                                    >
                                        {getAvatarLetter()}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <div className="flex flex-col space-y-1 p-2">
                                        <p className="text-sm font-medium leading-none">
                                            {user?.username}
                                        </p>
                                        <p className="text-xs leading-none text-gray-500">
                                            {user?.email}
                                        </p>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Link href="/profile" className="w-full text-left">
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    {orders.length > 0 && (
                                        <DropdownMenuItem>
                                            <Link href="/orders" className="w-full text-left">
                                                My Orders
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={logoutHandler}
                                        className="cursor-pointer text-red-600 focus:text-red-600"
                                    >
                                        <LogOut size={16} className="mr-2" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
