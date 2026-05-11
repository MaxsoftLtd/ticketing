import { Publisher, Subjects, TicketUpdatedEvent } from "@hmtickets.org/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}