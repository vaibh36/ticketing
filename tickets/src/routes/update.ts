import express, {Request, Response}  from "express";
import {requireAuth} from '../middlewares/require-auth'
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";
import { Ticket } from "../models/tickets";
import { NotAuthorizedError } from "../errors/not-authorized-error"; 
import { NotFoundError } from "../errors/not-found-error";
import { TicketUpdatedPublisher } from "../events/publisher/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";
import jwt from 'jsonwebtoken'
import { BadRequestError } from "../errors/bad-request-error";


const router = express.Router()
router.put('/api/tickets/:id', [
        body('title')
        .not()
        .isEmpty()
        .withMessage('Title is required'),
        body('price')
       .isFloat({gt:0})
        .withMessage('Price must be greater than 0')
    ], async(req:Request, res: Response)=>{

        let payload

         try{
          payload = jwt.verify(
        req?.session?.jwt,
        process.env.JWT_KEY!
    )
    console.log('jwt payload here is:-', payload)
}catch(e){}

   


    const ticket = await Ticket.findById(req.params.id)
    if(!ticket){
        console.log('Ticket not found where the ticket is1:-', req.params.id)
        throw new NotFoundError()
    }

    if(ticket?.orderId){
        console.log('I am here with orderid:-', ticket?.orderId)
        throw new BadRequestError('Ticket is already reserved')
    }

    // @ts-ignore
    if(ticket.userId !== payload?.id){
        console.log('Seems I am not authorized1')
        throw new NotAuthorizedError()
    }

    ticket.set({
        title: req.body.title,
        price: req.body.price
    })

    await ticket.save()
       new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId || '',
            version: ticket.version
        })

    res.send(ticket)

})

export {router as updateTicketRouter}