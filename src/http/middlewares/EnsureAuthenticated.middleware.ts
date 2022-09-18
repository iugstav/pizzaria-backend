import type { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export class EnsureAuthenticatedMiddleware {
  public constructor() {}

  public async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const auth = req.headers.authorization;

      if (!auth) {
        return res
          .status(401)
          .json({ error: "Without authentication credentials" });
      }

      try {
        const [, token] = auth.split(" ");
        verify(token, process.env.JWT_SECRET_KEY as string);

        return next();
      } catch (error: any) {
        return res.status(403).json({ error: "Invalid authentication token" });
      }
    } catch (error) {
      return res.status(403).json({ error: "Unauthorized resource" });
    }
  }
}
