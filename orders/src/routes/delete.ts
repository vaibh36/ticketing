import express, {Request, Response}  from "express";
import { Order } from "../models/orders";

import { NotFoundError } from "../errors/not-found-error";
import jwt from 'jsonwebtoken'
import { NotAuthorizedError } from "../errors/not-authorized-error";
import {OrderCancelledPublisher} from '../events/publishers/order-cancelled-publisher'
import { natsWrapper } from "../nats-wrapper";


const router = express.Router()
router.delete('/api/orders/:orderId', async(req:Request, res: Response)=>{

    const {orderId} = req.params
    const order = await Order.findById(orderId)
    console.log('info in delete order is:-', orderId, order)
    let payload

    
         try{
          payload = jwt.verify(
        req?.session?.jwt,
        process.env.JWT_KEY!
    )
    console.log('jwt payload here in delete is:-', payload)
}catch(e){}

    if(!order){
        throw new NotFoundError()
    }

   
    // @ts-ignore
    if(order?.userId !== payload?.id!) {
        throw new NotAuthorizedError()
    }
    await order.save()
     new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
     version: order.version,
    ticket:{
        id: order.ticket.id
    }
   })


    res.status(204).send(order)

})

export {router as deleteOrderRouter}