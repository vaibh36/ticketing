import { CustomError } from './custom-error'

export class BadRequestError extends CustomError{
    statusCode= 400

    constructor(public message: string){
        super(message)
        Object.setPrototypeOf(this, BadRequestError.prototype)
    }

    serializeErrors(){
          return [{message: 'This email is already in use'}]
    }

}