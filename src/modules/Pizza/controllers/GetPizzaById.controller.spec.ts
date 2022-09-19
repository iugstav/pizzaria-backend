/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import { app } from "../../../server";
import request from "supertest";
import { prismaClient } from "../../../database/prisma";
import { randomUUID } from "crypto";
import { authenticateAdminUser } from "../../../test/utils/AuthenticateUser";

describe("Get Pizza by Id controller (e2e)", () => {
  beforeAll(async () => {
    await prismaClient.categories.create({
      data: {
        id: randomUUID(),
        name: "Pizzas Doces",
      },
    });
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  it("Should be able to get a pizza by its id", async () => {
    const { token } = authenticateAdminUser();

    const pizzaId = randomUUID();

    await prismaClient.pizzas.create({
      data: {
        id: pizzaId,
        name: "Pizza de Nutella",
        price: 45.0,
        category: "Pizzas Doces",
        description: "AAAAAAAA",
        created_at: new Date(),
      },
    });

    const response = await request(app)
      .get(`/pizzas/find/${pizzaId}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      pizza: {
        id: pizzaId,
        name: "Pizza de Nutella",
        price: 45.0,
        category: "Pizzas Doces",
        description: "AAAAAAAA",
      },
    });
  });
});
