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

describe("Get All Order Items from Order controller (e2e)", () => {
  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  it("Should be able to return all the order items from an existing order", async () => {
    const { token } = authenticateAdminUser();
    const userId = randomUUID();
    const addressId = randomUUID();
    const orderId = randomUUID();
    const orderItemId1 = randomUUID();
    const orderItemId2 = randomUUID();
    const pizzaId1 = randomUUID();
    const pizzaId2 = randomUUID();
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
      prismaClient.pizzas.createMany({
        data: [
          {
            id: pizzaId1,
            name: "Pizza de Calabresa",
            price: 40.0,
            category: "Pizzas Salgadas",
            created_at: new Date(),
            description: "aaaaaaaaaaa",
          },
          {
            id: pizzaId2,
            name: "Pizza de Frango",
            price: 50.0,
            category: "Pizzas Salgadas",
            created_at: new Date(),
            description: "bbbbbbbbbbbbbbbbbb",
          },
        ],
      }),
      prismaClient.orders.create({
        data: {
          id: orderId,
          order_status: 0,
          total_price: 90.0,
          payment_type: "money",
          delivered_date: null,
          created_at: new Date(),
          user_id: userId,
        },
      }),
      prismaClient.orderItems.createMany({
        data: [
          {
            id: orderItemId1,
            pizza_id: pizzaId1,
            order_id: orderId,
            amount: 1,
            customization: "sem cebola",
          },
          {
            id: orderItemId2,
            pizza_id: pizzaId2,
            order_id: orderId,
            amount: 1,
            customization: "muita cebola",
          },
        ],
      }),
    ]);

    const response = await request(app)
      .get(`/items/${orderId}/all`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      orderItems: [
        expect.objectContaining({
          id: orderItemId1,
          amount: 1,
          customization: "sem cebola",
        }),
        expect.objectContaining({
          id: orderItemId2,
          amount: 1,
          customization: "muita cebola",
        }),
      ],
    });
  });
});
