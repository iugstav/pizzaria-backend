/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from "supertest";
import { randomUUID } from "crypto";

import { app } from "../../../server";
import { prismaClient } from "../../../database/prisma";
import { authenticateAdminUser } from "../../../test/utils/AuthenticateUser";
import { hash } from "bcryptjs";
import { Role } from "../../User/User";

describe("Get All Orders controller (e2e)", () => {
  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  it("Should be able to get all orders in persistence", async () => {
    const { token } = authenticateAdminUser();
    const orderId1 = randomUUID();
    const orderId2 = randomUUID();
    const userId = randomUUID();
    const addressId = randomUUID();

    await prismaClient.$transaction([
      prismaClient.addresses.create({
        data: {
          id: addressId,
          address1: "Rua Gilberto Machado, Cachoeiro de Itapemirim",
          number: 453,
          state: "Espírito Santo",
        },
      }),
      prismaClient.users.create({
        data: {
          id: userId,
          first_name: "John",
          last_name: "Doe",
          email: "johndoe10@mail.com",
          password: await hash("johndoe123", 8),
          address_id: addressId,
          role: Role.Customer,
          phone: "(21) 2345-6789",
        },
      }),
    ]);

    await prismaClient.orders.createMany({
      data: [
        {
          id: orderId1,
          total_price: 40.0,
          payment_type: "money",
          order_status: 0,
          created_at: new Date(),
          delivered_date: null,
          user_id: userId,
        },
        {
          id: orderId2,
          total_price: 50.0,
          order_status: 0,
          payment_type: "money",
          delivered_date: null,
          created_at: new Date(),
          user_id: userId,
        },
      ],
    });

    const response = await request(app)
      .get("/orders/")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      orders: [
        expect.objectContaining({
          id: orderId1,
          total_price: 40.0,
        }),
        expect.objectContaining({
          id: orderId2,
          total_price: 50.0,
        }),
      ],
    });
  });
});
