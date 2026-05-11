import { OrderCreatedEvent, Publisher, Subjects } from "@hmtickets.org/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
