import { Publisher, Subjects, TicketCreatedEvent } from "@hmtickets.org/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}