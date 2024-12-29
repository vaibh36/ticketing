import { Listener, OrderCreatedEvent, Subjects } from "@vaibhtickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {

    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = 'tickets-service'

    async onMessage(data: OrderCreatedEvent['data'], msg: Message){

        const ticket = await Ticket.findById(data.ticket.id)
        if(!ticket){
            throw new Ticket('Ticket not found')
        }

        ticket.set({orderId: data.id})
        await ticket.save()

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId || '',
            orderId: ticket.orderId,
            version: ticket.version
        })
        console.log('After order was created, it is now perfectly listened by the ticket part')
        msg.ack()

    }

}