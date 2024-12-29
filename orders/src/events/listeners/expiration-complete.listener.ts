import { Listener, ExpirationCompleteEvent, Subjects, OrderStatus } from "@vaibhtickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
     queueGroupName = 'expiration-service'
    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId).populate('ticket')

        if(!order){
            throw new Error('Order not found')
        }

        order.set({
            status: OrderStatus.Cancelled,
        })
        await order.save()
        new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket:{
                id: order.ticket.id
            }
        })
        msg.ack()
    }
    
}