import { ProductType } from "@/types/product";
import { Types } from "mongoose";

export interface ShippingAddress {
    fullName: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
}

export interface PaymentInfo {
    cardNumber: string;
    nameOnCard: string;
    expiryDate: string;
    cvv: string;
}

export interface DetailedOrderItem {
    productId: string;
    quantity: number;
    price: number;
    total: number;
    product?: ProductType;
}

export interface OrderModel {
    user: Types.ObjectId;
    items: Types.DocumentArray<Omit<DetailedOrderItem, "product">>;
    shippingAddress: ShippingAddress;
    paymentInfo: PaymentInfo;
    total: number;
    status: "pending" | "delivered" | "cancelled";
    createdAt?: Date;
    updatedAt?: Date;
}

export interface OrderItem extends OrderModel {
    _id: string;
    items: DetailedOrderItem[];
    user: string;
    __v?: number;
}
