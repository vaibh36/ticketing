import {Publisher, Subjects, TicketUpdatedEvent} from '@vaibhtickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated

}