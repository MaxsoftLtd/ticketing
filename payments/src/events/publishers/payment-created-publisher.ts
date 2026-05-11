import { PaymentCreatedEvent, Publisher, Subjects } from "@hmtickets.org/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}