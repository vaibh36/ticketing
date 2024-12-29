import { Subjects, Publisher, ExpirationCompleteEvent } from "@vaibhtickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
    
}