/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from "supertest";

import { app } from "../../../server";
import { prismaClient } from "../../../database/prisma";
import { authenticateAdminUser } from "../../../test/utils/AuthenticateUser";

describe("Create category controller (e2e)", () => {
  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  it("Should be able to create a category", async () => {
    const { token } = authenticateAdminUser();

    const response = await request(app)
      .post("/categories/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Pizzas Veganas",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual({
      message: "Categoria criada",
    });
  });
});
