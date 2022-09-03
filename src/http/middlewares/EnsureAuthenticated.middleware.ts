import { NextFunction, Request, Response } from "express";
import { decode } from "jsonwebtoken";

type decodedJWT = {
  sub: string;
};

export class EnsureAuthenticatedMiddleware {
  public constructor() {}

  public async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const auth = req.headers?.["x-access-token"];

      if (!auth) {
        return res
          .status(401)
          .json({ error: "Without authorization credentials" });
      }

      try {
        const decodedToken = decode(auth as string) as decodedJWT;

        return res.status(200).json({ userId: decodedToken.sub });
      } catch (error: any) {
        return res.status(403).json({ error: error.message });
      }
    } catch (error) {
      return res.status(403).json({ error: "Unauthorized resource" });
    }
  }
}
