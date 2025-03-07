import mongoose from "mongoose";

import { TicketDoc } from "./ticket";

export declare enum OrderStatus {
    Created = "created",
    Cancelled = "cancelled",
    AwaitingPayment = "awaiting:payment",
    Complete = "complete"
}


interface OrderAttrs {

    userId: string;
    status: string;
    expiresAt: Date;
    ticket: TicketDoc

}

interface OrderDoc extends mongoose.Document {
      userId: string;
    status: string;
    expiresAt: Date;
      ticket: TicketDoc
       version: number;

}

interface OrderModel extends mongoose.Model<OrderDoc>{
    build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true,
        default: 'created'
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date
    },
    ticket :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket"
    }

}, {
    toJSON:{
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id
        }
    }
})

orderSchema.statics.build = (attrs: OrderAttrs)=>{
    return new Order(attrs)
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)

export {Order}