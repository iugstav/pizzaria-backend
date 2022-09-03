/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import { app } from "../../../server";
import request from "supertest";
import { prismaClient } from "../../../database/prisma";

describe("Create pizza controller", () => {
  beforeAll(async () => {
    await prismaClient.categories.createMany({
      data: [{ id: "123", name: "Pizzas Salgadas" }],
    });
  });

  afterAll(async () => {
    const deleteCategories = prismaClient.categories.deleteMany();
    const deletePizzas = prismaClient.pizzas.deleteMany();

    await prismaClient.$transaction([deletePizzas, deleteCategories]);

    await prismaClient.$disconnect();
  });

  it("Should be able to create a new pizza", async () => {
    const response = await request(app).post("/pizzas/create").send({
      name: "Pizza de Frango",
      price: 35.0,
      category: "Pizzas Salgadas",
      description: "a",
      created_at: new Date(),
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Pizza criada" });
  });
});
