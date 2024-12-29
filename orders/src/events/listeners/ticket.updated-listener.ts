import { Message } from "node-nats-streaming";
import { Listener, Subjects, TicketUpdatedEvent } from "@vaibhtickets/common";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
    queueGroupName = 'orders-service'

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message){
        console.log('this is the litener of orders when ticket is updated')
        const ticket = await Ticket.findByEvent(data)
        if(!ticket){
            console.log('seems ticket not found in listeners of orders after ticket is updated:-', data)
            throw new Error('Ticket not found')
        }
        const {price, title} = data
        ticket.set({title, price})
        await ticket.save()
        msg.ack()
    }
}