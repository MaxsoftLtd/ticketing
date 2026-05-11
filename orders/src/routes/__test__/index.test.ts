import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();
  return ticket;
};

it("fetches orders for user", async () => {
  // create three tickets
  const t1 = await buildTicket();
  const t2 = await buildTicket();
  const t3 = await buildTicket();

  const user1 = global.signin();
  const user2 = global.signin();

  // create order as user 1
  await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({ ticketId: t1.id })
    .expect(201);

  // create 2 orders as user 2
  const { body: o1 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: t2.id })
    .expect(201);

  const { body: o2 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: t3.id })
    .expect(201);

  // make request to get orders for user 2
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", user2)
    .expect(200);

  // expect to only get orders for user 2
  expect(response.body.length).toEqual(2);

  expect(response.body[0].id).toEqual(o1.id);
  expect(response.body[1].id).toEqual(o2.id);

  expect(response.body[0].ticket.id).toEqual(t2.id);
  expect(response.body[1].ticket.id).toEqual(t3.id);
});
