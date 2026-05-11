import { OrderCreatedEvent, OrderStatus } from "@hmtickets.org/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create a ticket
  const ticket = Ticket.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    title: "Concert",
  });
  await ticket.save();

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date().toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // create a fake Message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it("sets order id of the ticket", async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const updatedticket = await Ticket.findById(ticket.id);
  expect(updatedticket!.orderId).toEqual(data.id);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
