import type { Request, Response } from "express";
import { DeleteCategoryService } from "../services/DeleteCategory.service";

export class DeleteCategoryController {
  public constructor(private deleteCategoryService: DeleteCategoryService) {}

  public async handle(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await this.deleteCategoryService.execute(id);

      return res.status(204).json();
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
}
