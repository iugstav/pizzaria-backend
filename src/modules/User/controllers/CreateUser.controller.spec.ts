/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import { app } from "../../../server";
import request from "supertest";
import { prismaClient } from "../../../database/prisma";
import { Role } from "../User";

describe("Create User controller (e2e)", () => {
  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  it("Should be able to create an user", async () => {
    const response = await request(app)
      .post("/users/create")
      .send({
        firstName: "John",
        lastName: "Doe",
        email: "johndoe10@mail.com",
        password: "johndoe123",
        address: {
          id: "1",
          address1: "Rua Gilberto Machado, Cachoeiro de Itapemirim",
          number: 453,
          state: "Espírito Santo",
        },
        role: Role.Customer,
        phone: "(21) 2345-6789",
      });

    expect(response.statusCode).toBe(201);

    const userExistsInPersistence = await prismaClient.users.findUnique({
      where: {
        email: "johndoe10@mail.com",
      },
    });

    expect(userExistsInPersistence).toBeTruthy();
  });

  it("Should not be able to create an user with invalid body", async () => {
    const response = await request(app)
      .post("/users/create")
      .send({
        firstName: "John",
        lastName: "Doe",
        // missing email field
        password: "johndoe123",
        address: {
          id: "1",
          address1: "Rua Gilberto Machado, Cachoeiro de Itapemirim",
          number: 453,
          state: "Espírito Santo",
        },
        role: Role.Customer,
        phone: "(21) 2345-6789",
      });

    expect(response.statusCode).toBe(400);
  });
});
