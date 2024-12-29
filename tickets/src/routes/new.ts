import express, {Request, Response}  from "express";
import {requireAuth} from '../middlewares/require-auth'
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";
import { Ticket } from "../models/tickets";
import jwt from 'jsonwebtoken'
import { TicketCreatedPublisher } from "../events/publisher/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

declare global {
    namespace Express {
        interface Request {
            currentUser?: {
                id: string;
                email: string;
                // Add any other properties here as needed
            };
        }
    }
}

const router = express.Router()

router.post('/api/tickets',
    // requireAuth,
    [
        body('title')
        .not()
        .isEmpty()
        .withMessage('Title is required'),
        body('price')
       .isFloat({gt:0})
        .withMessage('Price must be greater than 0')
    ],
    
    // validateRequest, 
    
    async(req: Request, res: Response)=>{
        let payload
       
        const {title, price} = req.body

         try{
          payload = jwt.verify(
        req?.session?.jwt,
        process.env.JWT_KEY!
    )
    console.log('jwt payload here is:-', payload)
}catch(e){}

            
         console.log('Payload here is:-', title, price, req?.currentUser?.id)
     
        const ticket = Ticket.build({
            // @ts-ignore
            title, price, userId: payload?.id || '',
        })
        await ticket.save()
        console.log('ticket has bee saved1')

        new TicketCreatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId || '',
            version: ticket.version
        })

    res.status(201).send(ticket)
})

export {router as createTicketRouter}