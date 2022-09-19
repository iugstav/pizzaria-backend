/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from "supertest";
import { randomUUID } from "crypto";

import { app } from "../../../server";
import { prismaClient } from "../../../database/prisma";
import { authenticateAdminUser } from "../../../test/utils/AuthenticateUser";

describe("Get All Pizzas controller (e2e)", () => {
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

  it("Should be able to get all pizzas from database", async () => {
    const { token } = authenticateAdminUser();

    await prismaClient.pizzas.createMany({
      data: [
        {
          id: randomUUID(),
          name: "Pizza de Banana com Chocolate",
          price: 35.0,
          category: "Pizzas Doces",
          description: "a",
          created_at: new Date(),
        },
        {
          id: randomUUID(),
          name: "Pizza de Morango",
          price: 30.0,
          category: "Pizzas Doces",
          description: "aaaaaaaaa",
          created_at: new Date(),
        },
      ],
    });

    const response = await request(app)
      .get("/pizzas/")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      pizzas: [
        expect.objectContaining({
          name: "Pizza de Banana com Chocolate",
          price: 35.0,
        }),
        expect.objectContaining({
          name: "Pizza de Morango",
          price: 30.0,
        }),
      ],
    });
  });
});
