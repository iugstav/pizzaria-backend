import type { Request, Response } from "express";
import { GetOrderItemByIdService } from "../services/GetOrderItemById.service";

export class GetOrderItemByIdController {
  public constructor(
    private getOrderItemByIdService: GetOrderItemByIdService
  ) {}

  public async handle(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const orderItem = await this.getOrderItemByIdService.execute(id);

      return res.status(200).json({ orderItem });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
}
