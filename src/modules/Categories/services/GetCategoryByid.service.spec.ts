import { Category } from "../Category";
import { ICategoriesRepository } from "../repositories/ICategories.repository";
import { InMemoryCategoriesRepository } from "../repositories/implementations/in-memory/InMemoryCategories.repository";
import { GetCategoryByIdService } from "./GetCategoryById.service";

let categoriesRepository: ICategoriesRepository;
let getCategoryByIdService: GetCategoryByIdService;

describe("Get Category By Id service", () => {
  beforeAll(() => {
    categoriesRepository = new InMemoryCategoriesRepository();
    getCategoryByIdService = new GetCategoryByIdService(categoriesRepository);
  });

  it("Should be able to get a category by it's id", async () => {
    const category = Category.create(
      {
        name: "Pizzas Gordas",
      },
      "abcd"
    );

    await categoriesRepository.save(category);

    const service = await getCategoryByIdService.execute("abcd");

    expect(service).toHaveProperty("id");
    expect(service.id).toEqual("abcd");
  });

  it("Should not be able to get a category with a wrong id", async () => {
    const category = Category.create(
      {
        name: "MiniPizzas",
      },
      "efgh"
    );

    await categoriesRepository.save(category);

    await expect(getCategoryByIdService.execute("1234")).rejects.toEqual(
      new Error("Categoria não existe")
    );
  });
});
