import nats from 'node-nats-streaming'
import { TicketCreatedPublisher } from './events/ticket-created-publisher'

const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
})

stan.on('connect', async()=>{
    console.log('Publisher connected to nats')

    const publisher = new TicketCreatedPublisher(stan)

    try {
         await publisher.publish({
        id: "123",
        price: 23,
        title: "3434"
    })

    } catch(e){}
  

    // const data = JSON.stringify({
    //     id: '123',
    //     title: "concert",
    //     price:20
    // })

    // stan.publish('ticket:created', data, ()=>{
    //     console.log('Event published1')
    // })

})