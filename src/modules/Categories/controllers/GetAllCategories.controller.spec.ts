/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from "supertest";
import { randomUUID } from "crypto";

import { app } from "../../../server";
import { prismaClient } from "../../../database/prisma";
import { authenticateAdminUser } from "../../../test/utils/AuthenticateUser";

describe("Get All Categories controller (e2e)", () => {
  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  it("Should be able to return all stored categories", async () => {
    const { token } = authenticateAdminUser();

    await prismaClient.categories.createMany({
      data: [
        {
          id: randomUUID(),
          name: "Pizzas Doces",
        },
        {
          id: randomUUID(),
          name: "Pizzas Salgadas",
        },
      ],
    });

    const response = await request(app)
      .get("/categories/")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      categories: [
        expect.objectContaining({
          name: "Pizzas Doces",
        }),

        expect.objectContaining({
          name: "Pizzas Salgadas",
        }),
      ],
    });
  });
});
