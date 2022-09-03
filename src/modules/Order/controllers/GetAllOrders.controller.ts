import type { Request, Response } from "express";
import { GetAllOrdersService } from "../services/GetAllOrders.service";

export class GetAllOrdersController {
  public constructor(private getAllOrdersService: GetAllOrdersService) {}

  public async handle(req: Request, res: Response) {
    try {
      const orders = await this.getAllOrdersService.execute();

      return res.status(200).json({ orders });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
}
