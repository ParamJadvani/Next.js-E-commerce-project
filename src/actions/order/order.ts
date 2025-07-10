// /actions/order/order.ts
"use server";

import DBConnect from "@/lib/db";
import Order from "@/model/Order";
import { Types } from "mongoose";
import { clearUserCart } from "../cart/cart";
import { OrderItem, OrderModel } from "@/types/order";

interface SerializedOrderItem extends OrderModel {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

function serializeOrderItem(item: SerializedOrderItem): OrderItem {
    return {
        _id: item._id.toString(),
        user: item.user.toString(),
        items: item.items,
        shippingAddress: item.shippingAddress,
        paymentInfo: item.paymentInfo,
        total: item.total,
        status: item.status,
        createdAt: item.createdAt,
    };
}

export async function createOrder(data: Omit<OrderItem, "_id">) {
    try {
        console.log(data);
        await DBConnect();

        const newOrder = await Order.create({
            user: data.user,
            items: data.items,
            shippingAddress: data.shippingAddress,
            paymentInfo: data.paymentInfo,
            total: data.total,
            status: "pending",
        });

        const clearCartResult = await clearUserCart(data.user);
        if (!clearCartResult.success) {
            console.warn(
                `Warning: Order ${newOrder._id} created, but failed to clear user cart.`,
                clearCartResult.error
            );
        }
        return {
            success: true,
            message: "Order created",
            order: JSON.parse(JSON.stringify(serializeOrderItem(newOrder))),
        };
    } catch (error) {
        console.error("Error creating order:", error);
        return { success: false, error: (error as Error).message };
    }
}

export async function getOrders(userId: string) {
    try {
        await DBConnect();
        const orders = (await Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .lean()) as SerializedOrderItem[];

        return { success: true, orders: orders.map(serializeOrderItem) };
    } catch (error) {
        console.error("Error getting orders:", error);
        return { success: false, error: (error as Error).message };
    }
}

export async function updateOrder(orderId: string, updatedData: OrderItem) {
    try {
        await DBConnect();
        const savedOrder = (await Order.findByIdAndUpdate(
            orderId,
            updatedData
        )) as SerializedOrderItem;
        if (!savedOrder) {
            return { success: false, error: "Order not found." };
        }
        return { success: true, order: serializeOrderItem(savedOrder) };
    } catch (error) {
        console.error("Error updating order:", error);
        return { success: false, error: (error as Error).message };
    }
}

export async function cancelOrder(userId: string, orderId: string) {
    try {
        await DBConnect();

        const updatedOrder = (await Order.findOneAndUpdate(
            { _id: orderId, user: userId },
            { status: "cancelled" },
            { new: true }
        )) as SerializedOrderItem;
        if (!updatedOrder) {
            return { success: false, error: "Order not found or does not belong to the user." };
        }

        return { success: true, order: serializeOrderItem(updatedOrder) };
    } catch (error) {
        console.error("Error cancelling order:", error);
        return { success: false, error: (error as Error).message };
    }
}
