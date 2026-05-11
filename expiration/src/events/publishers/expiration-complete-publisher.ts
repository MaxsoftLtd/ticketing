import { ExpirationCompleteEvent, Publisher, Subjects } from "@hmtickets.org/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}