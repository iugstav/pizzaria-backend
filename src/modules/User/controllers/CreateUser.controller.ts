import type { Request, Response } from "express";

import { CreateUserService } from "../services/CreateUser.service";

export class CreateUserController {
  public constructor(private createUserService: CreateUserService) {}

  public async handle(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, password, phone, role, address } =
        req.body;

      if (
        !firstName ||
        !lastName ||
        !email ||
        !password ||
        !phone ||
        !address
      ) {
        return res.status(400).json({ error: "Invalid request body." });
      }

      //TODO: CREATE DTO WITH CLASS-VALIDATOR
      const service = await this.createUserService.execute({
        firstName,
        lastName,
        email,
        password,
        phone,
        role: role,
        address,
      });

      return res.status(200).json({ value: service });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
}
