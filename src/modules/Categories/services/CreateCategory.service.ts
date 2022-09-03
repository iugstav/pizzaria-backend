import { randomUUID } from "crypto";

import { Category } from "../Category";
import { ICategoriesRepository } from "../repositories/ICategories.repository";

type CreateCategoryServiceRequest = {
  name: string;
};

export class CreateCategoryService {
  public constructor(private categoriesRepository: ICategoriesRepository) {}

  public async execute(category: CreateCategoryServiceRequest) {
    const categoryId = randomUUID();

    const newCategory = Category.create(category, categoryId);

    await this.categoriesRepository.save(newCategory);

    return newCategory;
  }
}
