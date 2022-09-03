import { prismaClient } from "../../../../database/prisma";
import { Pizza } from "../../Pizza";
import { IPizzasRepository } from "../IPizzas.repository";

export class PrismaPizzasRepository implements IPizzasRepository {
  public constructor() {}

  public async save({ id, properties }: Pizza): Promise<void> {
    const pizzaCategory = await prismaClient.categories.findUnique({
      where: { name: properties.category },
    });

    if (!pizzaCategory) {
      throw new Error("Categoria inválida");
    }

    const pizzaAlreadyExists = await this.exists(id);

    if (pizzaAlreadyExists) {
      throw new Error("A pizza já existe no cardápio.");
    }

    await prismaClient.pizzas.create({
      data: {
        id: id,
        name: properties.name,
        price: properties.price,
        category: pizzaCategory.name,
        description: properties.description,
        created_at: properties.created_at,
      },
    });
  }

  public async getAll(): Promise<Pizza[]> {
    const pizzas = await prismaClient.pizzas.findMany();

    return pizzas.map((pizza) =>
      Pizza.create(
        {
          name: pizza.name,
          price: pizza.price,
          category: pizza.category,
          description: pizza.description,
          created_at: pizza.created_at,
        },
        pizza.id
      )
    );
  }

  public async getById(id: string): Promise<Pizza> {
    const pizza = await prismaClient.pizzas.findUnique({
      where: {
        id,
      },
    });

    if (pizza === null) {
      throw new Error("Pizza not found.");
    }

    return Pizza.create(
      {
        name: pizza.name,
        price: pizza.price,
        category: pizza.category,
        description: pizza.description,
        created_at: pizza.created_at,
      },
      pizza.id
    );
  }

  public async delete(id: string): Promise<void> {
    await prismaClient.pizzas.delete({
      where: {
        id,
      },
    });
  }

  public async exists(id: string): Promise<boolean> {
    const pizzaExists = await prismaClient.pizzas.findUnique({
      where: { id },
    });

    return pizzaExists ? true : false;
  }
}
