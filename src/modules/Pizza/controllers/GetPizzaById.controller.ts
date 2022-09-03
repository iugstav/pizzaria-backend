import { Request, Response } from "express";
import { GetPizzaByIdService } from "../services/GetPizzaById.service";

export class GetPizzaByIdController {
  public constructor(private getPizzaByIdService: GetPizzaByIdService) {}

  public async handle(req: Request, res: Response) {
    try {
      const pizzaId = req.params.id;

      const pizza = await this.getPizzaByIdService.execute(pizzaId);

      return res.status(200).json({ pizza: pizza });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
}
