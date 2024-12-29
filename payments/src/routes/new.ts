import express, {Request, Response}  from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import { natsWrapper } from "../nats-wrapper";
import { Order } from "../../models/order";

const router = express.Router()

const EXPIRATION_WINDOW_SECONDS = 15*60

router.post('/api/payments',[

    body('token')
    .not()
    .isEmpty()
,  body('orderId')
    .not()
    .isEmpty()



], async(req:Request, res: Response)=>{
    const {toke, orderId} = req.body
    const order = await Order.findById(orderId)

    if(!order){
        throw new Error('Order not found')
    }

      let payload

    
         try{
          payload = jwt.verify(
        req?.session?.jwt,
        process.env.JWT_KEY!
    )
    console.log('jwt payload here for orders is:-', payload)
}catch(e){}
   
})

export {router as chargeCreatedRouter}