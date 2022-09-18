import { Request, Response, Router } from "express";

import { PrismaPizzasRepository } from "./repositories/implementations/PrismaPizzas.repository";
import { CreatePizzaController } from "./controllers/CreatePizza.controller";
import { GetAllPizzasController } from "./controllers/GetAllPizzas.controller";
import { GetPizzaByIdController } from "./controllers/GetPizzaById.controller";
import { RemovePizzaController } from "./controllers/RemovePizza.controller";
import { CreatePizzaService } from "./services/CreatePizza.service";
import { GetAllPizzasService } from "./services/GetAllPizzas.service";
import { GetPizzaByIdService } from "./services/GetPizzaById.service";
import { RemovePizzaService } from "./services/RemovePizza.service";
import { EnsureAuthenticatedMiddleware } from "../../http/middlewares/EnsureAuthenticated.middleware";
import { EnsureIsAdminMiddleware } from "../../http/middlewares/EnsureIsAdmin.middleware";

const pizzasRouter = Router();

// repository
const pizzasRepository = new PrismaPizzasRepository();

// services
const getAllPizzasService = new GetAllPizzasService(pizzasRepository);
const getPizzaByIdService = new GetPizzaByIdService(pizzasRepository);
const createPizzaService = new CreatePizzaService(pizzasRepository);
const removePizzaService = new RemovePizzaService(pizzasRepository);

// controllers
const getAllPizzasController = new GetAllPizzasController(getAllPizzasService);
const getPizzaByIdController = new GetPizzaByIdController(getPizzaByIdService);
const createPizzaController = new CreatePizzaController(createPizzaService);
const removePizzaController = new RemovePizzaController(removePizzaService);

const ensureAuthenticatedMiddleware = new EnsureAuthenticatedMiddleware();
const ensureIsAdminMiddleware = new EnsureIsAdminMiddleware();

pizzasRouter.use(ensureAuthenticatedMiddleware.handle);

pizzasRouter.get("/", (req: Request, res: Response) =>
  getAllPizzasController.handle(req, res)
);
pizzasRouter.get("/find/:id", (req: Request, res: Response) =>
  getPizzaByIdController.handle(req, res)
);

pizzasRouter.post(
  "/create",
  ensureIsAdminMiddleware.handle,
  (req: Request, res: Response) => createPizzaController.handle(req, res)
);

pizzasRouter.delete(
  "/remove/:id",
  ensureIsAdminMiddleware.handle,
  (req: Request, res: Response) => removePizzaController.handle(req, res)
);

export { pizzasRouter };
