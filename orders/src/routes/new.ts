import express, {Request, Response}  from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../models/ticket";
import { Order, OrderStatus } from "../models/orders";
import { BadRequestError, NotFoundError } from "@vaibhtickets/common";
import jwt from 'jsonwebtoken'
import {OrderCreatedPublisher} from '../events/publishers/order-created-publisher'
import { natsWrapper } from "../nats-wrapper";

const router = express.Router()

const EXPIRATION_WINDOW_SECONDS = 15*60

router.post('/api/orders',[

    body('ticketId')
    .not()
    .isEmpty()
    .withMessage('Ticket id must be provided')



], async(req:Request, res: Response)=>{
    const {ticketId} = req.body
   
    let payload

    
         try{
          payload = jwt.verify(
        req?.session?.jwt,
        process.env.JWT_KEY!
    )
    console.log('jwt payload here for orders is:-', payload)
}catch(e){}

 console.log('I am here and the data is1:-', ticketId)
   const ticket = await Ticket.findById(ticketId)

   if(!ticket){
    console.log('ticket is not found2:-', ticket)
    throw new NotFoundError()
   }

   const isReserved = await ticket.isReserved()

   if(isReserved){
    throw new BadRequestError('Ticket is already reserved1')
   }

   const expiration = new Date()
   expiration.setSeconds(expiration.getSeconds() + 15*60 + EXPIRATION_WINDOW_SECONDS)

   const order = Order.build({
    // @ts-ignore
    userId: payload?.id || '',
    status: 'created',
    expiresAt: expiration,
    ticket
   })

   await order.save()
   console.log('Seems order has been build')
   new OrderCreatedPublisher(natsWrapper.client).publish({
    id: order.id,
    // @ts-ignore
    status: order.status,
     version: order.version,
    userId: order.userId,
    expiresAt: order.expiresAt.toISOString(),
    ticket:{
        id: ticket.id,
        price: ticket.price
    }
   })
    

    res.status(201).send(order)

})

export {router as newOrderRouter}