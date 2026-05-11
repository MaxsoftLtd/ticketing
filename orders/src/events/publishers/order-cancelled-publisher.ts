import { OrderCancelledEvent, Publisher, Subjects } from "@hmtickets.org/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}