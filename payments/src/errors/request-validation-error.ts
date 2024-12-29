import {ValidationError} from 'express-validator'
import { CustomError } from './custom-error'



export class RequestValidationError extends CustomError {
     statusCode= 400

    constructor(public errors: ValidationError[]){
        super('Invalid request parameters')
        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }
  
      serializeErrors(){

        this.errors?.map((err)=>{
            console.log('error here is:-', err.msg)
        })
        
        return this.errors?.map((err)=>{
            return {
                message: err?.msg, field: err?.type
            }
        })
    }

}