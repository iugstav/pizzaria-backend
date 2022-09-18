import { Request, Response } from "express";
import { CreateOrderService } from "../services/CreateOrder.service";

export class CreateOrderController {
  public constructor(private createOrderService: CreateOrderService) {}

  public async handle(req: Request, res: Response) {
    try {
      const {
        id,
        total_price,
        payment_type,
        order_status,
        created_at,
        order_items,
        user_id,
      } = req.body;

      if (
        !id ||
        !total_price ||
        !payment_type ||
        !order_status ||
        !created_at ||
        !order_items ||
        !user_id
      ) {
        return res.status(400).json({ error: "Invalid request body." });
      }

      await this.createOrderService.execute({
        id,
        total_price,
        payment_type,
        order_status,
        created_at,
        order_items,
        user_id,
      });

      return res.status(200).json({ message: "Pedido criado" });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
}
