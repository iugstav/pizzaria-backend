import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import type { Request, Response, NextFunction } from "express";

import { categoriesRouter } from "./modules/Categories/categories.routes";
import { ordersRouter } from "./modules/Order/order.routes";
import { orderItemsRouter } from "./modules/OrderItems/orderItem.routes";
import { pizzasRouter } from "./modules/Pizza/pizzas.routes";
import { usersRouter } from "./modules/User/user.routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(cookieParser());

app.use("/users", usersRouter);
app.use("/pizzas", pizzasRouter);
app.use("/categories", categoriesRouter);
app.use("/orders", ordersRouter);
app.use("/items", orderItemsRouter);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof Error) {
    return res.status(404).json({
      error: error.message,
    });
  }

  return res.status(500).json({
    error: `Internal Server Error - ${error}`,
  });
});

export { app };
