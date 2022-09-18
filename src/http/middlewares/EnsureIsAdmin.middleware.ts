import type { NextFunction, Request, Response } from "express";
import { decode } from "jsonwebtoken";

type JWTPayload = {
  role: string;
};

export class EnsureIsAdminMiddleware {
  public constructor() {}

  public async handle(req: Request, res: Response, next: NextFunction) {
    try {
      // this will run after EnsureAuthenticatedMiddleware, so we are sure that authorization is set
      const auth = req.headers.authorization!;

      const [, token] = auth.split(" ");
      const userRole = decode(token) as JWTPayload;

      if (userRole.role !== "ADMIN") {
        return res
          .status(403)
          .json({ error: "Unauthorized action: User is not admin" });
      }

      next();
    } catch (error) {
      return res.status(403).json({ error: "Unauthorized resource" });
    }
  }
}
