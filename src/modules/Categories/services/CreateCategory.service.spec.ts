import { Category } from "../Category";
import { ICategoriesRepository } from "../repositories/ICategories.repository";
import { InMemoryCategoriesRepository } from "../repositories/implementations/in-memory/InMemoryCategories.repository";
import { CreateCategoryService } from "./CreateCategory.service";

let categoriesRepository: ICategoriesRepository;
let createCategoryService: CreateCategoryService;

describe("Create Category service", () => {
  beforeAll(() => {
    categoriesRepository = new InMemoryCategoriesRepository();
    createCategoryService = new CreateCategoryService(categoriesRepository);
  });

  it("Should be able to create a category", async () => {
    const category = await createCategoryService.execute({
      name: "Pizzas Veganas",
    });

    expect(await categoriesRepository.exists(category.id)).toBeTruthy();
  });
});
