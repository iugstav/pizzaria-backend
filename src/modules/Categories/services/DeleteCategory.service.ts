import { ICategoriesRepository } from "../repositories/ICategories.repository";

export class DeleteCategoryService {
  public constructor(private categoriesRepository: ICategoriesRepository) {}

  public async execute(id: string) {
    await this.categoriesRepository.delete(id);

    return;
  }
}
