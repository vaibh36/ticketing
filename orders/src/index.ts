import express from 'express'
import {json} from 'body-parser'


import mongoose from 'mongoose'
import cookieSession from 'cookie-session'
import { natsWrapper } from './nats-wrapper';
import { deleteOrderRouter } from './routes/delete';
import { showOrderRouter } from './routes/show';
import { newOrderRouter } from './routes/new';
import { indexOrderRouter } from './routes';
import { NotFoundError } from '@vaibhtickets/common';
import { errorHandler } from './middlewares/error-handler';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket.updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete.listener';

console.log('I am in orders as of now')
const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
    cookieSession({
        signed: false,
        secure: false, 
    })
);
  // app.use(currentUser)
app.use(newOrderRouter)
app.use(deleteOrderRouter)
app.use(showOrderRouter)
app.use(indexOrderRouter)
app.all('*', ()=>{
    console.log('route not found2')
    throw new NotFoundError()
})


 app.use(errorHandler)

const start = async ()=>{

    if(!process.env.JWT_KEY){
        throw new Error('JWT key should be defined')
    }


    try{
        await natsWrapper.connect('ticketing', 'last1', 'http://nats-srv:4222')

           natsWrapper.client.on('close', ()=>{
            process.exit()
        })


        process.on('SIGINT', ()=> natsWrapper.client.close())
        process.on('SIGTERM', ()=> natsWrapper.client.close())

        new TicketCreatedListener(natsWrapper.client).listen()
        new TicketUpdatedListener(natsWrapper.client).listen()
        new ExpirationCompleteListener(natsWrapper.client).listen()

        await mongoose.connect('mongodb://orders-mongo-srv:27017/orders', {
            // @ts-ignore
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000
})
        console.log('Connected to mongodb of orders now')
    }catch(err){
        console.log('Error here is:-', err)
    }

    app.listen(3000, ()=>{
    console.log('listening on 3000 new day3')
})
  
}

start()


