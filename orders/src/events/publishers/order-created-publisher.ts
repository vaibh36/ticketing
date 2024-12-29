// @ts-nocheck
import {Publisher} from '@vaibhtickets/common'

export enum OrderStatus {
    Created= 'created',
    Cancelled = 'cancelled',
    AwaitingPayment = 'awaiting:payment',
    Complete = 'complete'
}


export enum Subjects {
    TicketCreated = 'ticket:created',
    OrderCreated = 'order:updated',
    TicketUpdated = 'ticket:updated',
    OrderCancelled = 'order:cancelled'
}

export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated;
    data:{
        id: string;
        status: OrderStatus
        userId: string
        expiresAt: string;
        ticket: {
            id: string;
            price: number
        }
    }
}

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated

}