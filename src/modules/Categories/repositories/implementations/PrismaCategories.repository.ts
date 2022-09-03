import { prismaClient } from "../../../../database/prisma";
import { Category } from "../../Category";
import { ICategoriesRepository } from "../ICategories.repository";

export class PrismaCategoriesRepository implements ICategoriesRepository {
  public constructor() {}

  async save(category: Category): Promise<void> {
    await prismaClient.categories.create({
      data: {
        id: category.id,
        name: category.properties.name,
        pizzas: undefined,
      },
    });

    return;
  }

  async getAll(): Promise<Category[]> {
    const categories = await prismaClient.categories.findMany({
      include: {
        pizzas: {
          orderBy: {
            created_at: "asc",
          },
        },
      },
    });

    return categories.map((category) =>
      Category.create(
        { name: category.name, pizzas: category.pizzas },
        category.id
      )
    );
  }

  async getById(id: string): Promise<Category> {
    const category = await prismaClient.categories.findUnique({
      where: {
        id,
      },

      include: {
        pizzas: {
          orderBy: {
            created_at: "asc",
          },
        },
      },
    });

    if (!category) {
      throw new Error("Categoria não existe");
    }

    return Category.create(
      { name: category.name, pizzas: category.pizzas },
      category.id
    );
  }

  async delete(id: string): Promise<void> {
    await prismaClient.categories.delete({
      where: {
        id,
      },
    });

    return;
  }

  async exists(id: string): Promise<boolean> {
    const categoryExists = await prismaClient.categories.findUnique({
      where: {
        id,
      },
    });

    return categoryExists ? true : false;
  }
}
