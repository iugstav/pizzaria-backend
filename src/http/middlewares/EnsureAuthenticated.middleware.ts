import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

type decodedJWT = {
  sub: string;
};

export class EnsureAuthenticatedMiddleware {
  public constructor() {}

  public async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const auth = req.headers.authorization;

      if (!auth) {
        // return res
        //   .status(401)
        //   .json({ error: "Without authorization credentials" });

        throw new Error("Without authorization credentials");
      }

      try {
        const [, token] = auth.split(" ");
        verify(token, process.env.JWT_SECRET_KEY as string);

        return next();
      } catch (error: any) {
        // return res.status(403).json({ error: "Invalid authorization token"});
        throw new Error("Invalid authorization token");
      }
    } catch (error) {
      // return res.status(403).json({ error: "Unauthorized resource" });
      throw new Error("Unauthorized resource");
    }
  }
}
