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

describe("Create Order Item controller (e2e)", () => {
  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  it("Should be able to create an order item", async () => {
    const { token } = authenticateAdminUser();
    const userId = randomUUID();
    const addressId = randomUUID();
    const orderId = randomUUID();
    const orderItemId = randomUUID();
    const pizzaId = randomUUID();
    const categoryId = randomUUID();

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

    await prismaClient.$transaction([
      prismaClient.categories.create({
        data: {
          id: categoryId,
          name: "Pizzas Salgadas",
        },
      }),
      prismaClient.pizzas.create({
        data: {
          id: pizzaId,
          name: "Pizza de Calabresa",
          price: 40.0,
          category: "Pizzas Salgadas",
          created_at: new Date(),
          description: "aaaaaaaaaaa",
        },
      }),
      prismaClient.orders.create({
        data: {
          id: orderId,
          order_status: 0,
          total_price: 40.0,
          payment_type: "money",
          delivered_date: null,
          created_at: new Date(),
          user_id: userId,
        },
      }),
    ]);

    const response = await request(app)
      .post("/items/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        pizza_id: pizzaId,
        order_id: orderId,
        amount: 1,
        customization: "muita cebola",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      message: "pedido criado",
    });
  });
});
