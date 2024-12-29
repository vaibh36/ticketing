import {Stan, Message} from 'node-nats-streaming'
import { Subjects } from './subjects'

interface Event {
    subject: Subjects;
    data: any
}

export abstract class Listener<T extends Event> {

    private client:Stan
    abstract subject: T['subject']
    abstract queueGroupName: string
    protected akWait = 5*1000
    abstract onMessage(data: T['data'], msg: Message): void

    constructor(client: Stan){
        this.client = client
    }

    subscriptionOptions(){
        return this.client.subscriptionOptions().setDeliverAllAvailable().setManualAckMode(true).setAckWait(this.akWait)
        .setDurableName(this.queueGroupName)
    }

    listen(){
        const subscription = this.client.subscribe(this.subject, this.queueGroupName, this.subscriptionOptions())
        subscription.on('message', (msg: Message)=>{
            console.log('Message received:-', this.subject)
            const parsedData = this.parseData(msg)
            this.onMessage(parsedData, msg)
        })
    }

    parseData(msg: Message){
        const data = msg.getData()
        return typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString('utf-8'))
    }
}