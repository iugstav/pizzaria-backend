import type { Request, Response } from "express";
import { CreateOrderItemService } from "../services/CreateOrderItem.service";

export class CreateOrderItemController {
  public constructor(private createOrderItemService: CreateOrderItemService) {}

  public async handle(req: Request, res: Response) {
    try {
      const { pizza_id, order_id, amount, customization } = req.body;

      if (!pizza_id || !order_id || !amount || !customization) {
        return res.status(400).json({ error: "invalid request body" });
      }

      await this.createOrderItemService.execute({
        pizza_id,
        order_id,
        amount,
        customization,
      });

      return res.status(200).json({ message: "pedido criado" });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
}
