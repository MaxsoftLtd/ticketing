import request from "supertest";
import { app } from "../../app";

it("response with current user", async () => {
  const cookie = await signin();

  if (!cookie) {
    throw new Error("Cookie not set after signup");
  }

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("response with current user of null if auth failed", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
