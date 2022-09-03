import { Category } from "../Category";

export interface ICategoriesRepository {
  save(category: Category): Promise<void>;
  getAll(): Promise<Category[]>;
  getById(id: string): Promise<Category>;
  delete(id: string): Promise<void>;

  exists(id: string): Promise<boolean>;
}
