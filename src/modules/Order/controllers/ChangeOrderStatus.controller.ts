import type { Request, Response } from "express";

import { ChangeOrderStatusService } from "../services/ChangeOrderStatus.service";

export class ChangeOrderStatusController {
  public constructor(
    private changeOrderStatusService: ChangeOrderStatusService
  ) {}

  public async handle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { newOrderStatus } = req.body;

      if (!newOrderStatus) {
        return res.status(400).json({ error: "Invalid request body." });
      }

      await this.changeOrderStatusService.execute({
        orderId: id,
        newOrderStatus,
      });

      return res.status(204);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
