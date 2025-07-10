// model/Order.ts

import { DetailedOrderItem, OrderModel, PaymentInfo, ShippingAddress } from "@/types/order";
import { Schema, models, model } from "mongoose";

const OrderItemSnapshotSchema = new Schema<DetailedOrderItem>(
    {
        productId: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        total: { type: Number, required: true },
    },
    { _id: false, versionKey: false }
);

const ShippingAddressSchema = new Schema<ShippingAddress>(
    {
        fullName: { type: String, required: true },
        streetAddress: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        phoneNumber: { type: String, required: true },
    },
    { _id: false, versionKey: false }
);

const PaymentInfoSchema = new Schema<PaymentInfo>(
    {
        cardNumber: { type: String, required: true },
        nameOnCard: { type: String, required: true },
        expiryDate: { type: String, required: true },
        cvv: { type: String, required: true },
    },
    { _id: false, versionKey: false }
);

const OrderSchema = new Schema<OrderModel>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        items: { type: [OrderItemSnapshotSchema], required: true },
        shippingAddress: ShippingAddressSchema,
        paymentInfo: PaymentInfoSchema,
        total: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "delivered", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true, versionKey: false }
);

const Order = models.Order || model<OrderModel>("Order", OrderSchema);
export default Order;
