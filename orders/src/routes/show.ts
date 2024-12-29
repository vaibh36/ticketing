import express, {Request, Response}  from "express";
import { Order } from "../models/orders";
import { NotAuthorizedError, NotFoundError } from "@vaibhtickets/common";
import jwt from 'jsonwebtoken'


const router = express.Router()
router.get('/api/orders/:orderId', async(req:Request, res: Response)=>{

     let payload

    
         try{
          payload = jwt.verify(
        req?.session?.jwt,
        process.env.JWT_KEY!
    )
    console.log('jwt payload here is:-', payload)
}catch(e){}

   const orderId = req?.params?.orderId
    const order = await Order.findById(orderId).populate('ticket')

    if(!order){
        throw new NotFoundError()
    }

    // @ts-ignore
    if(order.userId !== payload?.id || ''){
        throw new NotAuthorizedError()
    }

    res.send(order)

})

export {router as showOrderRouter}