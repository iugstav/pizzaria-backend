import { Request, Response } from "express";
import NodeCache from "node-cache";
import { GetAllPizzasService } from "../services/GetAllPizzas.service";

const TIME_TO_LIVE_IN_SECONDS = 60 * 60;

const cache = new NodeCache();

export class GetAllPizzasController {
  public constructor(private getAllPizzasService: GetAllPizzasService) {}

  public async handle(req: Request, res: Response) {
    try {
      if (cache.get("pizzas")) {
        return res.status(200).json({ pizzas: cache.get("pizzas") });
      }

      const pizzas = await this.getAllPizzasService.execute();

      cache.set("pizzas", pizzas, TIME_TO_LIVE_IN_SECONDS);

      return res.status(200).json({ pizzas });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
}
