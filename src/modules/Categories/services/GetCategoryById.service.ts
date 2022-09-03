import { ICategoriesRepository } from "../repositories/ICategories.repository";

export class GetCategoryByIdService {
  public constructor(private categoriesRepository: ICategoriesRepository) {}

  public async execute(id: string) {
    const pizza = await this.categoriesRepository.getById(id);

    return pizza;
  }
}
