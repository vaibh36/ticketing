import { Message } from "node-nats-streaming";
import { Listener, Subjects, TicketCreatedEvent } from "@vaibhtickets/common";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated
    queueGroupName = 'orders-service'

    async onMessage(data: TicketCreatedEvent['data'], msg: Message){

        const {title, price, id} = data
        const ticket = Ticket.build({
            title, price, id
        })

        await ticket.save()
        msg.ack()

    }

}