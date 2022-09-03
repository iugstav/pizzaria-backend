import { Request, Response } from "express";
import { CreateCategoryService } from "../services/CreateCategory.service";

export class CreateCategoryController {
  public constructor(private createCategoryService: CreateCategoryService) {}

  public async handle(req: Request, res: Response) {
    try {
      const { name } = req.body;

      await this.createCategoryService.execute({
        name,
      });

      return res.status(201).json({ message: "Categoria criada" });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
}
