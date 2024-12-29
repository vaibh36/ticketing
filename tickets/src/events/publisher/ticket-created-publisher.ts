import {Publisher, Subjects, TicketCreatedEvent} from '@vaibhtickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated

}