import { Request, Response, Router } from "express";
import { EnsureAuthenticatedMiddleware } from "../../http/middlewares/EnsureAuthenticated.middleware";
import { EnsureIsAdminMiddleware } from "../../http/middlewares/EnsureIsAdmin.middleware";
import { CreateCategoryController } from "./controllers/CreateCategory.controller";
import { DeleteCategoryController } from "./controllers/DeleteCategory.controller";
import { GetAllCategoriesController } from "./controllers/GetAllCategories.controller";
import { GetCategoryByIdController } from "./controllers/GetCategoryByid.controller";
import { PrismaCategoriesRepository } from "./repositories/implementations/PrismaCategories.repository";
import { CreateCategoryService } from "./services/CreateCategory.service";
import { DeleteCategoryService } from "./services/DeleteCategory.service";
import { GetAllCategoriesService } from "./services/GetAllCategories.service";
import { GetCategoryByIdService } from "./services/GetCategoryById.service";

const categoriesRouter = Router();

// repository
const categoriesRepository = new PrismaCategoriesRepository();

// services
const createCategoryService = new CreateCategoryService(categoriesRepository);
const deleteCategoryService = new DeleteCategoryService(categoriesRepository);
const getAllCategoriesService = new GetAllCategoriesService(
  categoriesRepository
);
const getCategoryByIdService = new GetCategoryByIdService(categoriesRepository);

// controllers
const getAllCategoriesController = new GetAllCategoriesController(
  getAllCategoriesService
);
const getCategoryByIdController = new GetCategoryByIdController(
  getCategoryByIdService
);
const createCategoryController = new CreateCategoryController(
  createCategoryService
);
const deleteCategoryController = new DeleteCategoryController(
  deleteCategoryService
);

// middlewares
const ensureAuthenticatedMiddleware = new EnsureAuthenticatedMiddleware();
const ensureIsAdminMiddleware = new EnsureIsAdminMiddleware();

categoriesRouter.use(ensureAuthenticatedMiddleware.handle);

categoriesRouter.get("/", (req: Request, res: Response) =>
  getAllCategoriesController.handle(req, res)
);
categoriesRouter.get("/:id", (req: Request, res: Response) =>
  getCategoryByIdController.handle(req, res)
);

categoriesRouter.post(
  "/create",
  ensureIsAdminMiddleware.handle,
  (req: Request, res: Response) => createCategoryController.handle(req, res)
);

categoriesRouter.delete(
  "/delete/:id",
  ensureIsAdminMiddleware.handle,
  (req: Request, res: Response) => deleteCategoryController.handle(req, res)
);

export { categoriesRouter };
