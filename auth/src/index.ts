import express from 'express'
import {json} from 'body-parser'
import {currentUserRouter} from './routes/current-user'
import {signinRouter} from './routes/signin'
import {signoutRouter} from './routes/signout'
import {signupRouter} from './routes/signup'
import {errorHandler} from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error'
import mongoose from 'mongoose'
import cookieSession from 'cookie-session'
import { currentUser } from './middlewares/current-user'

console.log('I am in auth as of now')
const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
    cookieSession({
        signed: false,
        secure: true, 
    })
);

//  app.use(currentUser)
app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

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
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
        console.log('Connected to mongodb')
    }catch(err){
        console.log('Error here is:-', err)
    }

    app.listen(3000, ()=>{
    console.log('listening on 3000 new day3')
})
  
}

start()


