import express, {Request, Response} from 'express'
import {body, validationResult} from 'express-validator'
import {RequestValidationError} from '../errors/request-validation-error'
import {BadRequestError} from '../errors/bad-request-error'
import {User} from '../models/user'
import jwt from 'jsonwebtoken'

const router = express.Router()
router.post('/api/users/signup', 
    
    [
        body('email')
        .isEmail()
        .withMessage('Email must be valid'),
        body('password')
        .trim()
        .isLength({min:4, max:20})
        .withMessage('must be between 4 and 20 characters')
    ]
    ,async(req: Request, res: Response)=>{
        const errors = validationResult(req)
        if(!errors?.isEmpty()){
            console.log('errors here are:-', errors)
            throw new RequestValidationError(errors?.array())
        }
        const {email, password} = req?.body
        const existingUser =  await User.findOne({email: email})
        if(existingUser){
            throw new BadRequestError('Email already in use')
        }

        const user = User.build({
            email, password
        })
        await user.save()
        const userJwt = jwt.sign({
            id: user?.id,
            email: user.email
        }, process.env.JWT_KEY!) 

        req.session = {
            jwt: userJwt
        }

        console.log('this will create the user')
        res.status(201).send(user)
})

export { router as signupRouter}