import { Request, Response } from "express";
import { GetOrderByIdService } from "../services/GetOrderById.service";

export class GetOrderByIdController {
  public constructor(private getOrderByIdService: GetOrderByIdService) {}

  public async handle(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "invalid request body" });
      }

      const order = await this.getOrderByIdService.execute(id);

      return res.status(200).json({ order });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
}
