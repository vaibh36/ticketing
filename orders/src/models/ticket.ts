import mongoose from "mongoose";
import { Order } from "./orders";
import {updateIfCurrentPlugin} from 'mongoose-update-if-current'




interface TicketAttrs {
    id: string
    title: string;
    price: number
}       

export interface TicketDoc extends mongoose.Document {
     title: string;
    price: number
    isReserved(): Promise<boolean>;
    version: number

}

interface TicketModel extends mongoose.Model<TicketDoc>{
    build(attrs: TicketAttrs): TicketDoc;
    findByEvent(event: {id: string, version: number}): Promise<TicketDoc | null>
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min:0
    }
}, {
    toJSON:{
        transform(oc, ret){
            ret.id = ret._id;
            delete ret._id
        }
    }
})


ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)
ticketSchema.statics.build = (attrs: TicketAttrs)=>{
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    })
}


ticketSchema.statics.findByEvent =(event: {id: string, version: number}) =>{
    console.log('this is the search function with the data:-', event)
    const data = Ticket.findOne({
        _id: event.id,
        version: event.version - 1
    })
  
    return data
}

ticketSchema.methods.isReserved = async function(){

    const existingOrder = await Order.findOne({
    ticket: this,
    status:{
        $in:[
            "created",
            "awaiting:payment",
            "complete"
        ]
    }
   })
   console.log('existingOrder is1:-', existingOrder)

   return !!existingOrder

}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export {Ticket}