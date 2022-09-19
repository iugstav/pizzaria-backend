/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import { app } from "../../../server";
import request from "supertest";
import { prismaClient } from "../../../database/prisma";
import { authenticateAdminUser } from "../../../test/utils/AuthenticateUser";

const { token } = authenticateAdminUser();

describe("Create pizza controller", () => {
  beforeAll(async () => {
    await prismaClient.categories.createMany({
      data: [{ id: "123", name: "Pizzas Salgadas" }],
    });
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  it("Should be able to create a new pizza", async () => {
    const response = await request(app)
      .post("/pizzas/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Pizza de Frango",
        price: 35.0,
        category: "Pizzas Salgadas",
        description: "a",
        created_at: new Date().toString(),
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Pizza criada" });
  });

  it("Should not be able to create a new pizza with invalid body", async () => {
    const response = await request(app)
      .post("/pizzas/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Pizza de Carne Seca",
        // missing price field
        category: "Pizzas Salgadas",
        description: "a",
        created_at: new Date().toString(),
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      error: "Invalid request body.",
    });
  });
});
