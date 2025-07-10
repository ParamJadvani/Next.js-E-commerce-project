// /helper/helper.ts
import { getUserFromCookie } from "@/actions/auth/auth";
import { getUserCart } from "@/actions/cart/cart";
import { getOrders } from "@/actions/order/order";
import userCartStore from "@/store/userCartStore";
import userOrderStore from "@/store/userOrderStore";
import userStore from "@/store/userStore";
import { CartItem } from "@/types/cart";
import { DetailedOrderItem, OrderItem } from "@/types/order";
import { ProductType } from "@/types/product";
import { UserType } from "@/types/user";

const productCache = new Map<string, ProductType>();

const fetchProduct = async (productId: string): Promise<ProductType | undefined> => {
    if (productCache.has(productId)) {
        return productCache.get(productId);
    }

    try {
        const productRes = await fetch(`https://fakestoreapi.com/products/${productId}`);
        if (!productRes.ok) {
            console.error(
                `Failed to fetch product ${productId}: ${productRes.status} ${productRes.statusText}`
            );
            return undefined;
        }
        const product: ProductType = await productRes.json();
        if (product && product.id) {
            productCache.set(productId, product);
            return product;
        } else {
            console.error(`Invalid product data received for ID ${productId}`);
            return undefined;
        }
    } catch (err) {
        console.error(`Network or parsing error fetching product ${productId}:`, err);
        return undefined;
    }
};

export async function fetchUserData(): Promise<UserType | null> {
    const { user: currentUser, setUser, isLoggedIn, logout } = userStore.getState();

    if (isLoggedIn && currentUser) {
        return currentUser;
    }

    if (!isLoggedIn) {
        try {
            const userDataFromCookie = await getUserFromCookie();
            if (userDataFromCookie) {
                setUser(userDataFromCookie);
                return userDataFromCookie;
            } else {
                logout();
                return null;
            }
        } catch (err) {
            console.error("Error verifying user token:", err);
            logout();
            return null;
        }
    }
    console.warn(
        "fetchUserData called with inconsistent state (isLoggedIn=true, user=null). Logging out."
    );
    logout();
    return null;
}

export async function fetchCartData(): Promise<CartItem[]> {
    const { setCart, cart } = userCartStore.getState();
    const user = userStore.getState().user;

    if (!user) {
        setCart([]);
        return [];
    }

    if (user && cart.length > 0) {
        return cart;
    }

    try {
        const cartResponse = await getUserCart(user.id);

        if (cartResponse.success && cartResponse.cart) {
            const cartWithProductDataPromises = cartResponse.cart.map(async (item) => {
                const product = await fetchProduct(item.productId);
                return { ...item, product };
            });

            const cartWithProductData = await Promise.all(cartWithProductDataPromises);
            setCart(cartWithProductData);
            return cartWithProductData;
        } else {
            console.error("Failed to fetch user cart from action:", cartResponse.error);
            setCart([]);
            return [];
        }
    } catch (err) {
        console.error("Error during cart data fetching or processing:", err);
        setCart([]);
        return [];
    }
}

export async function fetchOrdersData(): Promise<OrderItem[]> {
    const { setOrders, orders } = userOrderStore.getState();
    const user = userStore.getState().user;

    if (!user) {
        setOrders([]);
        return [];
    }

    if (user && orders.length > 0) {
        return orders;
    }

    try {
        const ordersResponse = await getOrders(user.id);

        if (ordersResponse.success && ordersResponse.orders) {
            const ordersWithProductDataPromises = ordersResponse.orders.map(async (order) => {
                //
                const productItemsPromises = order.items.map(async (item) => {
                    const product = await fetchProduct(item.productId);
                    return { ...item, product };
                }) as Promise<DetailedOrderItem>[];

                const productItems = await Promise.all(productItemsPromises);
                return {
                    ...order,
                    items: productItems,
                    createdAt: order.createdAt ? new Date(order.createdAt) : undefined,
                };
            });

            const ordersWithProductData = await Promise.all(ordersWithProductDataPromises);
            setOrders(ordersWithProductData);
            return ordersWithProductData;
        } else {
            console.error("Failed to fetch user orders from action:", ordersResponse.error);
            setOrders([]);
            return [];
        }
    } catch (err) {
        console.error("Error during orders data fetching or processing:", err);
        setOrders([]);
        return [];
    }
}
