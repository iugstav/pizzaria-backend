/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from "supertest";
import { randomUUID } from "crypto";

import { app } from "../../../server";
import { prismaClient } from "../../../database/prisma";
import { authenticateAdminUser } from "../../../test/utils/AuthenticateUser";

describe("Get Category By Id controller (e2e)", () => {
  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  it("Should be able to get a category by its id", async () => {
    const { token } = authenticateAdminUser();
    const categoryId = randomUUID();

    await prismaClient.categories.create({
      data: {
        id: categoryId,
        name: "Pizzas Salgadas",
      },
    });

    const response = await request(app)
      .get(`/categories/${categoryId}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      category: expect.objectContaining({
        name: "Pizzas Salgadas",
      }),
    });
  });
});
