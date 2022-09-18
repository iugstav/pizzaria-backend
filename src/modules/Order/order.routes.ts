import { Request, Response, Router } from "express";

import { PrismaOrdersRepository } from "./repositories/implementations/PrismaOrders.repository";
import { CreateOrderController } from "./controllers/CreateOrder.controller";
import { GetAllOrdersController } from "./controllers/GetAllOrders.controller";
import { GetOrderByIdController } from "./controllers/GetOrderById.controller";
import { CreateOrderService } from "./services/CreateOrder.service";
import { GetAllOrdersService } from "./services/GetAllOrders.service";
import { GetOrderByIdService } from "./services/GetOrderById.service";
import { EnsureAuthenticatedMiddleware } from "../../http/middlewares/EnsureAuthenticated.middleware";

const ordersRouter = Router();

// repository
const ordersRepository = new PrismaOrdersRepository();

// services
const getAllOrdersService = new GetAllOrdersService(ordersRepository);
const getOrderByIdService = new GetOrderByIdService(ordersRepository);
const createOrderService = new CreateOrderService(ordersRepository);

// controllers
const createOrderController = new CreateOrderController(createOrderService);
const getAllOrdersController = new GetAllOrdersController(getAllOrdersService);
const getOrderByIdController = new GetOrderByIdController(getOrderByIdService);

// middlewares
const ensureAuthenticatedMiddleware = new EnsureAuthenticatedMiddleware();

ordersRouter.use(ensureAuthenticatedMiddleware.handle);

ordersRouter.get("/", (req: Request, res: Response) =>
  getAllOrdersController.handle(req, res)
);
ordersRouter.get("/:id", (req: Request, res: Response) =>
  getOrderByIdController.handle(req, res)
);

ordersRouter.post("/create", (req: Request, res: Response) =>
  createOrderController.handle(req, res)
);

export { ordersRouter };
