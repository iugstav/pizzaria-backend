import type { Request, Response } from "express";
import { GetAllCategoriesService } from "../services/GetAllCategories.service";

export class GetAllCategoriesController {
  public constructor(
    private getAllCategoriesService: GetAllCategoriesService
  ) {}

  public async handle(req: Request, res: Response) {
    try {
      const categories = await this.getAllCategoriesService.execute();

      return res.status(200).json({ categories });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
}
