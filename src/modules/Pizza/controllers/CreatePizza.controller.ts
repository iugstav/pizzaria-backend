import type { Request, Response } from "express";
import { CreatePizzaService } from "../services/CreatePizza.service";

export class CreatePizzaController {
  public constructor(private createPizzaService: CreatePizzaService) {}

  public async handle(req: Request, res: Response) {
    try {
      const { name, price, category, description, created_at } = req.body;

      if (!name || !price || !category || !description || !created_at) {
        return res.status(400).json({ error: "Invalid request body." });
      }

      await this.createPizzaService.execute({
        name,
        price,
        category,
        description,
        created_at: new Date(created_at),
      });

      return res.status(200).json({ message: "Pizza criada" });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
}
