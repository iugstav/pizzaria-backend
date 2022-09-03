import { Request, Response, Router } from "express";

import { AuthenticateUserController } from "./controllers/AuthenticateUser.controller";
import { CreateUserController } from "./controllers/CreateUser.controller";
import { PrismaUsersRepository } from "./repositories/implementations/PrismaUsers.repository";
import { AuthenticateUserService } from "./services/AuthenticateUser.service";
import { CreateUserService } from "./services/CreateUser.service";

const usersRouter = Router();

const usersRepository = new PrismaUsersRepository();

const createUserService = new CreateUserService(usersRepository);
const authenticateUserService = new AuthenticateUserService(usersRepository);

const createUserController = new CreateUserController(createUserService);
const authenticateUserController = new AuthenticateUserController(
  authenticateUserService
);

usersRouter.post("/create", (req: Request, res: Response) =>
  createUserController.handle(req, res)
);

usersRouter.post("/login", (req: Request, res: Response) =>
  authenticateUserController.handle(req, res)
);

export { usersRouter };
