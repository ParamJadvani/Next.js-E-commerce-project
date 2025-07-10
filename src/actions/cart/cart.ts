// /actions/cart/cart.ts
"use server";

import DBConnect from "@/lib/db";
import CartItemModel from "@/model/Cart";
import { CartItem, CartModel } from "@/types/cart";
import { Types } from "mongoose";

interface SerializedCartItem extends CartModel {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

function serializeCartItem(item: SerializedCartItem): CartItem {
    return {
        _id: item._id.toString(),
        productId: item.productId,
        user: item.user.toString(),
        quantity: item.quantity,
        price: item.price,
        total: item.total,
        product: undefined,
    };
}

export async function getUserCart(userId: string) {
    try {
        await DBConnect();
        const cartItems = (await CartItemModel.find({
            user: userId,
        }).lean()) as SerializedCartItem[];

        return { success: true, cart: cartItems.map(serializeCartItem) };
    } catch (error) {
        console.error("Error getting user cart:", error);
        return { success: false, error: (error as Error).message };
    }
}

export async function addToCart(
    userId: string,
    productId: string,
    quantity: number,
    price: number
) {
    try {
        await DBConnect();
        const existingItem = await CartItemModel.findOne({ user: userId, productId });
        let savedItem: SerializedCartItem;
        let message: string;

        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.total = existingItem.price * existingItem.quantity;
            savedItem = await existingItem.save();
            message = "Quantity updated";
        } else {
            savedItem = await CartItemModel.create({
                user: userId,
                productId,
                quantity,
                price,
                total: price * quantity,
            });
            message = "Item added to cart";
        }

        return {
            success: true,
            message: message,
            item: serializeCartItem(savedItem),
        };
    } catch (error) {
        console.error("Error adding to cart:", error);
        return { success: false, error: (error as Error).message };
    }
}

export async function updateCartQuantity(cartId: string, quantity: number) {
    try {
        await DBConnect();
        const cartItem = await CartItemModel.findById(cartId);

        if (!cartItem) {
            return { success: false, error: "Cart item not found" };
        }

        const updatedQuantity = Math.max(1, quantity);
        cartItem.quantity = updatedQuantity;
        cartItem.total = updatedQuantity * cartItem.price;

        const savedItem = (await cartItem.save()) as SerializedCartItem;

        return {
            success: true,
            message: "Quantity updated",
            item: serializeCartItem(savedItem),
        };
    } catch (error) {
        console.error("Error updating cart quantity:", error);
        return { success: false, error: (error as Error).message };
    }
}

export async function removeFromCart(cartId: string) {
    try {
        await DBConnect();
        const itemToDelete: SerializedCartItem | null = await CartItemModel.findByIdAndDelete(
            cartId
        );

        if (!itemToDelete) {
            return { success: true, message: "Item not found or already removed." };
        }

        return {
            success: true,
            message: "Item removed",
            item: serializeCartItem(itemToDelete),
        };
    } catch (error) {
        console.error("Error removing from cart:", error);
        return { success: false, error: (error as Error).message };
    }
}

export async function clearUserCart(userId: string) {
    try {
        await DBConnect();
        const deleteResult = await CartItemModel.deleteMany({ user: userId });
        return { success: true, message: `${deleteResult.deletedCount} items removed from cart.` };
    } catch (error) {
        console.error("Error clearing user cart:", error);
        return { success: false, error: (error as Error).message };
    }
}
