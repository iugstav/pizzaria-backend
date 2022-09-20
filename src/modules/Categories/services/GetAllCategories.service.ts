import { ICategoriesRepository } from "../repositories/ICategories.repository";

export class GetAllCategoriesService {
  public constructor(private categoriesRepository: ICategoriesRepository) {}

  public async execute() {
    const categories = await this.categoriesRepository.getAll();

    const formattedCategories = categories.map((category) => {
      return {
        id: category.id,
        name: category.properties.name,
        pizzas: category.properties.pizzas ?? [],
      };
    });

    return formattedCategories;
  }
}
