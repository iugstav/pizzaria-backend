import { Request, Response } from "express";
import { GetCategoryByIdService } from "../services/GetCategoryById.service";

export class GetCategoryByIdController {
  public constructor(private getCategoryByIdService: GetCategoryByIdService) {}

  public async handle(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const category = await this.getCategoryByIdService.execute(id);

      return res.status(200).json({ category });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
}
