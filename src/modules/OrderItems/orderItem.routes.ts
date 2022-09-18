import { Request, Response, Router } from "express";
import { EnsureAuthenticatedMiddleware } from "../../http/middlewares/EnsureAuthenticated.middleware";
import { PrismaOrdersRepository } from "../Order/repositories/implementations/PrismaOrders.repository";
import { PrismaOrderItemsRepository } from "./repositories/implementations/PrismaOrderItems.repository";
import { PrismaPizzasRepository } from "../Pizza/repositories/implementations/PrismaPizzas.repository";
import { CreateOrderItemController } from "./controllers/CreateOrderItem.controller";
import { GetAllOrderItemsFromOrderController } from "./controllers/GetAllOrderItemsFromOrder.controller";
import { GetOrderItemByIdController } from "./controllers/GetOrderItemById.controller";
import { CreateOrderItemService } from "./services/CreateOrderItem.service";
import { GetAllOrderItemsFromOrderService } from "./services/GetAllOrderItemsFromOrder.service";
import { GetOrderItemByIdService } from "./services/GetOrderItemById.service";

const orderItemsRouter = Router();

// repositories
const orderItemsRepository = new PrismaOrderItemsRepository();
const ordersRepository = new PrismaOrdersRepository();
const pizzasRepository = new PrismaPizzasRepository();

// services
const getAllOrderItemsFromOrderService = new GetAllOrderItemsFromOrderService(
  orderItemsRepository
);
const getOrderItemByIdService = new GetOrderItemByIdService(
  orderItemsRepository
);
const createOrderItemService = new CreateOrderItemService(
  orderItemsRepository,
  ordersRepository,
  pizzasRepository
);

// controllers
const getAllOrderItemsFromOrderController =
  new GetAllOrderItemsFromOrderController(getAllOrderItemsFromOrderService);
const getOrderItemByIdController = new GetOrderItemByIdController(
  getOrderItemByIdService
);
const createOrderItemController = new CreateOrderItemController(
  createOrderItemService
);

// middlewares
const ensureAuthenticatedMiddleware = new EnsureAuthenticatedMiddleware();

orderItemsRouter.use(ensureAuthenticatedMiddleware.handle);

orderItemsRouter.get("/:orderId/all", (req: Request, res: Response) =>
  getAllOrderItemsFromOrderController.handle(req, res)
);
orderItemsRouter.get("/:id", (req: Request, res: Response) =>
  getOrderItemByIdController.handle(req, res)
);

orderItemsRouter.post("/create", (req: Request, res: Response) =>
  createOrderItemController.handle(req, res)
);

export { orderItemsRouter };
