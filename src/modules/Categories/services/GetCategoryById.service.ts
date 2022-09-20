import { ICategoriesRepository } from "../repositories/ICategories.repository";

export class GetCategoryByIdService {
  public constructor(private categoriesRepository: ICategoriesRepository) {}

  public async execute(id: string) {
    const category = await this.categoriesRepository.getById(id);

    return {
      id: category.id,
      name: category.properties.name,
      pizzas: category.properties.pizzas ?? [],
    };
  }
}
