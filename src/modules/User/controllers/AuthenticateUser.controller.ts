import { Request, Response } from "express";
import { AuthenticateUserService } from "../services/AuthenticateUser.service";

export class AuthenticateUserController {
  public constructor(
    private authenticateUserService: AuthenticateUserService
  ) {}

  public async handle(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "invalid request body" });
      }

      const { token } = await this.authenticateUserService.execute({
        email,
        password,
      });

      return res.status(200).json({ token });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
}
