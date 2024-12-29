import express from 'express'
import {json} from 'body-parser'
import {createTicketRouter} from './routes/new'
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes';
import {errorHandler} from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error'
import mongoose from 'mongoose'
import cookieSession from 'cookie-session'
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
import { updateTicketRouter } from './routes/update';

console.log('I am in tickets as of now')
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
app.use(createTicketRouter)
app.use(updateTicketRouter)
app.use(showTicketRouter)
app.use(indexTicketRouter)
app.all('*', ()=>{
    throw new NotFoundError()
})

// @ts-ignore
app.use(errorHandler)

const start = async ()=>{

    if(!process.env.JWT_KEY){
        throw new Error('JWT key should be defined')
    }


    try{
        await natsWrapper.connect('ticketing', 'last', 'http://nats-srv:4222')

           natsWrapper.client.on('close', ()=>{
            process.exit()
        })


        process.on('SIGINT', ()=> natsWrapper.client.close())
        process.on('SIGTERM', ()=> natsWrapper.client.close())

        new OrderCreatedListener(natsWrapper.client).listen()
        new OrderCancelledListener(natsWrapper.client).listen()


        await mongoose.connect('mongodb://tickets-mongo-srv:27017/tickets', {
            // @ts-ignore
    useNewUrlParser: true,
    useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000
})
        console.log('Connected to mongodb of tickets now')
    }catch(err){
        console.log('Error here is:-', err)
    }

    app.listen(3000, ()=>{
    console.log('listening on 3000 new day3')
})
  
}

start()


