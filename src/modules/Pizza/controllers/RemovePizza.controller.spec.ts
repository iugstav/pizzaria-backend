/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from "supertest";
import { randomUUID } from "crypto";

import { app } from "../../../server";
import { prismaClient } from "../../../database/prisma";
import { authenticateAdminUser } from "../../../test/utils/AuthenticateUser";

describe("Remove Pizza controller (e2e)", () => {
  beforeAll(async () => {
    await prismaClient.categories.create({
      data: {
        id: randomUUID(),
        name: "Pizzas Salgadas",
      },
    });
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  it("Should be able to remove a pizza", async () => {
    const { token } = authenticateAdminUser();
    const pizzaId = randomUUID();

    await prismaClient.pizzas.create({
      data: {
        id: pizzaId,
        name: "Pizza de frango com catupiry",
        price: 40.0,
        category: "Pizzas Salgadas",
        description: "aaaaaaaaa",
        created_at: new Date(),
      },
    });

    const response = await request(app)
      .delete(`/pizzas/remove/${pizzaId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      message: "Pizza removida",
    });
  });
});
