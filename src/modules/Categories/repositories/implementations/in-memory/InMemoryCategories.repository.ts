import { Category } from "../../../Category";
import { ICategoriesRepository } from "../../ICategories.repository";

export class InMemoryCategoriesRepository implements ICategoriesRepository {
  public categories: Category[] = [];

  public constructor() {}

  public async save(category: Category): Promise<void> {
    this.categories.push(category);
  }

  public async getAll(): Promise<Category[]> {
    return this.categories;
  }

  public async getById(id: string): Promise<Category> {
    const category = this.categories.find((category) => category.id === id);

    if (!category) {
      throw new Error("Categoria não existe");
    }

    return category;
  }

  public async delete(id: string): Promise<void> {
    const categoryIndex = this.categories.findIndex(
      (category) => category.id === id
    );

    this.categories.splice(categoryIndex, 1);
  }

  public async exists(id: string): Promise<boolean> {
    return this.categories.find((category) => category.id === id)
      ? true
      : false;
  }
}
