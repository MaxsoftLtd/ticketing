import { Listener, OrderCreatedEvent, Subjects } from "@hmtickets.org/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // get the orders ticket
    const ticket = await Ticket.findById(data.ticket.id);
    // throw error if not found
    if (!ticket) throw new Error("Ticket not found");

    // mark as reserved
    ticket.set({ orderId: data.id });

    // save the ticket
    await ticket.save();

    // publish event
    await new TicketUpdatedPublisher(this.client).publish(ticket);

    // ack the message
    msg.ack();
  }
}
