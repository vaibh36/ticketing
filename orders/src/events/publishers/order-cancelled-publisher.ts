// @ts-nocheck
import {Publisher} from '@vaibhtickets/common'

export enum Subjects {
    TicketUpdated = 'ticket:updated',
    OrderCancelled = 'order:cancelled'
}

export interface OrderCancelledEvent {
    subject: Subjects.OrderCancelled;
    data:{
        id: string;
         version: number,
        ticket: {
            id: string;
        }
    }
}

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
     subject: Subjects.OrderCancelled = Subjects.OrderCancelled

}