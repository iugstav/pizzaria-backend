/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from "supertest";

import { app } from "../../../server";
import { prismaClient } from "../../../database/prisma";
import { authenticateAdminUser } from "../../../test/utils/AuthenticateUser";
import { randomUUID } from "crypto";

describe("Delete Category controller (e2e)", () => {
  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  it("Should be able to delete a category", async () => {
    const { token } = authenticateAdminUser();
    const categoryId = randomUUID();

    await prismaClient.categories.create({
      data: {
        id: categoryId,
        name: "Pizzas Veganas",
      },
    });

    const response = await request(app)
      .delete(`/categories/delete/${categoryId}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(204);
  });
});
