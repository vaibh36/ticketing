import { CustomError } from './custom-error'

export class DatabaseConnectionError extends CustomError{
    reason = 'Error connecting to database9'
    statusCode= 500

    constructor(){
        super('Error conecting to DB')
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }

    serializeErrors(){
        return [
            {message: this.reason}
        ]
    }

}