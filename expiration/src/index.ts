import express from 'express'
import {json} from 'body-parser'

import {errorHandler} from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error'
import mongoose from 'mongoose'
import cookieSession from 'cookie-session'
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener'

console.log('I am in expiration as of now')
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
        await natsWrapper.connect('ticketing', 'last2', 'http://nats-srv:4222')

           natsWrapper.client.on('close', ()=>{
            process.exit()
        })


        process.on('SIGINT', ()=> natsWrapper.client.close())
        process.on('SIGTERM', ()=> natsWrapper.client.close())

        new OrderCreatedListener(natsWrapper.client).listen()





        
    }catch(err){
        console.log('Error here is:-', err)
    }

 
  
}

start()


