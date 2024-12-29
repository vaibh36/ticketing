import express,{Request, Response}  from 'express'
import jwt from 'jsonwebtoken'
import {currentUser} from '../middlewares/current-user'
import { requireAuth } from '../middlewares/require-auth'

const router = express.Router()
// @ts-ignore
router.get('/api/users/currentuser', (req: Request, res: Response)=>{
  console.log('I am in current user:-', req?.session?.jwt)
    if(!req?.session?.jwt){
        return res.send({currentUser: null})
    }

    try{
         const payload = jwt.verify(
        req?.session?.jwt,
        process.env.JWT_KEY!
    )
    console.log('current user here is:-', payload)
    res.send({currentUser: payload})
    }catch(e){
        res.send({currentUser: null})
    }

   



 
})

export { router as currentUserRouter}