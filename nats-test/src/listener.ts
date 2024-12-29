import nats, { Message , Stan} from 'node-nats-streaming'
import { TicketCreatedListener } from './events/ticket-created-listener'


console.clear()

const stan = nats.connect('ticketing', '123', {
    url: 'http://localhost:4222'
})
    // const options = stan.subscriptionOptions().setManualAckMode(true)

  

stan.on('connect', ()=>{
    console.log('Listener connected to nats')

    stan.on('close', ()=>{
        process.exit()
    })

//   const subscription = stan.subscribe('ticket:created', 'order-service-queue-group', options)
    // subscription.on('message', (msg: Message)=>{
    //     console.log('Message received:-', msg?.getData())
    //     msg.ack()
    // })


    new TicketCreatedListener(stan).listen()
})

process.on('SIGINT', ()=> stan.close())
process.on('SIGTERM', ()=> stan.close())




