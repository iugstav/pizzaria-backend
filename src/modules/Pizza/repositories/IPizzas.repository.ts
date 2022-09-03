import { Pizza, PizzaProps } from "../Pizza";

export interface IPizzasRepository {
  save(pizza: Pizza): Promise<void>;
  getAll(): Promise<Pizza[]>;
  getById(id: string): Promise<Pizza>;
  // updateName(id: string, newName: string): Promise<void>;
  // updatePrice(id: string, newPrice: string): Promise<void>;
  // updateCategory(id: string, newCategoryId: string): Promise<void>;
  delete(id: string): Promise<void>;
  exists(name: string): Promise<boolean>;
}
