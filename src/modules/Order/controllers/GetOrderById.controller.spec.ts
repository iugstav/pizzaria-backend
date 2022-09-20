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

describe("Get Order By Id controller (e2e)", () => {
  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  it("Should be able to get an order by its id", async () => {
    const { token } = authenticateAdminUser();
    const orderId = randomUUID();
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

    await prismaClient.orders.create({
      data: {
        id: orderId,
        total_price: 40.0,
        payment_type: "money",
        order_status: 0,
        created_at: new Date(),
        delivered_date: null,
        user_id: userId,
      },
    });

    const response = await request(app)
      .get(`/orders/${orderId}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      order: expect.objectContaining({
        id: orderId,
        total_price: 40.0,
      }),
    });
  });
});
