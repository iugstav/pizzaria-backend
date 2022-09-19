/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from "supertest";
import { randomUUID } from "crypto";

import { hash } from "bcryptjs";
import { prismaClient } from "../../../database/prisma";
import { Role } from "../User";
import { app } from "../../../server";

describe("Authenticate User controller (e2e)", () => {
  beforeAll(async () => {
    const address = await prismaClient.addresses.create({
      data: {
        id: randomUUID(),
        address1: "Rua Gilberto Machado, Cachoeiro de Itapemirim",
        number: 300,
        state: "RJ",
      },
    });

    await prismaClient.users.create({
      data: {
        id: randomUUID(),
        first_name: "John",
        last_name: "Doe",
        email: "doejohn@somemail.com",
        password: await hash("password000111", 8),
        role: Role.Customer,
        phone: "(21) 2345-6789",
        address_id: address.id,
      },
    });
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  it("Should be able to authenticate an user", async () => {
    const response = await request(app).post("/users/login").send({
      email: "doejohn@somemail.com",
      password: "password000111",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      })
    );
  });
});
