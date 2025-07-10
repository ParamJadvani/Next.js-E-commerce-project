// /app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Package, ShoppingCart } from "lucide-react";
import { fetchCartData, fetchOrdersData, fetchUserData } from "@/helper/helper";
import { Metadata } from "next";
import { openGraph } from "@/utils/openGraphMeta";
import { twitter } from "@/utils/twitterMeta";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
    let title = "Ember Shop - Discover Quality Products";
    let description =
        "Welcome to Ember Shop, your destination for curated products for every need.";
    let ogTitle = "Ember Shop";
    let ogDescription = description;

    try {
        const userData = await fetchUserData();
        if (userData?.username) {
            const welcomeTitle = `Welcome ${userData.username} to Ember Shop`;
            const personalizedDesc = `Explore personalized product recommendations at Ember Shop, curated for ${userData.username}.`;
            title = welcomeTitle;
            description = personalizedDesc;
            ogTitle = welcomeTitle;
            ogDescription = personalizedDesc;
        }
    } catch (err) {
        console.error("Error fetching user data for metadata:", err);
    }

    return {
        title,
        description,
        alternates: {
            canonical: "/",
            languages: {
                "en-US": "https://localhost:3000/",
            },
        },
        openGraph: {
            ...openGraph,
            title: ogTitle,
            description: ogDescription,
            url: "/",
        },
        twitter: {
            ...twitter,
            title: ogTitle,
            description: ogDescription,
        },
    };
}

export default async function Home() {
    let userData = null;
    try {
        [userData] = await Promise.all([fetchUserData(), fetchCartData(), fetchOrdersData()]);
    } catch (err) {
        console.error("Error initializing data for Home page:", err);
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <section className="mb-16 text-center">
                <div className="space-y-4 mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold">
                        Welcome{userData?.username ? `, ${userData.username}` : ""} to Ember Shop
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Discover our curated collection of products for every need.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-blue-100/40 border-blue-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-6 text-center space-y-4">
                            <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                                <ShoppingBag size={32} className="text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold">Shop Products</h3>
                            <p className="text-gray-500">
                                Browse our full catalog of quality products.
                            </p>
                            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 mt-2">
                                <Link href="/products">Browse Products</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-green-100/40 border-green-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-6 text-center space-y-4">
                            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-3">
                                <ShoppingCart size={32} className="text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold">Your Cart</h3>
                            <p className="text-gray-500">View your cart and proceed to checkout.</p>
                            <Button
                                asChild
                                className="w-full bg-green-600 hover:bg-green-700 text-white mt-2"
                            >
                                <Link href="/cart">View Cart</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-yellow-100/40 border-yellow-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-6 text-center space-y-4">
                            <div className="mx-auto w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-3">
                                <Package size={32} className="text-yellow-600" />
                            </div>
                            <h3 className="text-xl font-semibold">Track Orders</h3>
                            <p className="text-gray-500">View and manage your order history.</p>
                            <Button
                                asChild
                                variant="outline"
                                className="w-full border-yellow-600 text-yellow-700 hover:bg-yellow-50 mt-2"
                            >
                                <Link href="/orders">My Orders</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <section className="mb-16">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold">Featured Categories</h2>
                    <p className="text-gray-500">Explore our most popular collections.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { name: "Electronics", query: "electronics" },
                        { name: "Jewelery", query: "jewelery" },
                        { name: "Men's Clothing", query: "men's clothing" },
                        { name: "Women's Clothing", query: "women's clothing" },
                    ].map((category) => (
                        <Link
                            href={`/products?q=${encodeURIComponent(category.query)}`}
                            key={category.query}
                        >
                            <div className="group relative overflow-hidden rounded-lg aspect-square bg-gray-100 hover:bg-blue-50 transition-colors flex items-center justify-center p-4 border border-gray-200 hover:border-blue-200">
                                <p className="text-lg md:text-xl font-medium text-gray-700 group-hover:text-blue-600 text-center">
                                    {category.name}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section>
                <div className="bg-blue-50 rounded-lg p-8 text-center border border-blue-100">
                    <h2 className="text-3xl font-bold mb-4">Ready to explore?</h2>
                    <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
                        Start browsing our collection and find exactly what you need.
                    </p>
                    <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                        <Link href="/products">Shop Now</Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
