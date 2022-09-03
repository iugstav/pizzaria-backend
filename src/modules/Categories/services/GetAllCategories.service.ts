import { ICategoriesRepository } from "../repositories/ICategories.repository";

export class GetAllCategoriesService {
  public constructor(private categoriesRepository: ICategoriesRepository) {}

  public async execute() {
    const categories = await this.categoriesRepository.getAll();

    return categories;
  }
}
