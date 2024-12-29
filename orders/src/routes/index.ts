import express, {Request, Response}  from "express";
import { Order } from "../models/orders";


const router = express.Router()
router.get('/api/orders', async(req:Request, res: Response)=>{

    const orders = await Order.find({})
    

    res.send(orders)

})

export {router as indexOrderRouter}