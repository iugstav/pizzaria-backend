import { Request, Response } from "express";

import { PrismaPizzasRepository } from "../repositories/implementations/PrismaPizzas.repository";
import { RemovePizzaService } from "../services/RemovePizza.service";

export class RemovePizzaController {
  public constructor(private removePizzaService: RemovePizzaService) {}

  public async handle(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await this.removePizzaService.execute(id);

      return res.status(200).json({ message: "Pizza removida" });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
}
