import type { Request, Response } from "express";
import { GetAllOrderItemsFromOrderService } from "../services/GetAllOrderItemsFromOrder.service";

export class GetAllOrderItemsFromOrderController {
  public constructor(
    private getAllOrderItemsFromOrderService: GetAllOrderItemsFromOrderService
  ) {}

  public async handle(req: Request, res: Response) {
    try {
      const { orderId } = req.params;

      const orderItem = await this.getAllOrderItemsFromOrderService.execute(
        orderId
      );

      return res.status(200).json({ orderItem });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
}
