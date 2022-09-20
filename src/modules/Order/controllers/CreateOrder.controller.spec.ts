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

describe("Create Order controller (e2e)", () => {
  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  it("Should be able to create an order", async () => {
    const { token } = authenticateAdminUser();
    const categoryId = randomUUID();
    const pizzaId = randomUUID();
    const orderId = randomUUID();
    const addressId = randomUUID();
    const userId = randomUUID();

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
          description: "AAAAAAAAAAAAAAA",
          created_at: new Date(),
        },
      }),
    ]);

    const response = await request(app)
      .post("/orders/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        id: orderId,
        total_price: 40.0,
        payment_type: "money",
        order_status: 0,
        created_at: new Date(),
        order_items: [
          {
            pizza_id: pizzaId,
            amount: 1,
            order_id: orderId,
            customization: "",
          },
        ],
        user_id: userId,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual({
      message: "Pedido criado",
    });
  });
});
