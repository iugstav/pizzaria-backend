import { Category } from "../Category";
import { ICategoriesRepository } from "../repositories/ICategories.repository";
import { InMemoryCategoriesRepository } from "../repositories/implementations/in-memory/InMemoryCategories.repository";
import { DeleteCategoryService } from "./DeleteCategory.service";

let categoriesRepository: ICategoriesRepository;
let deleteCategoryService: DeleteCategoryService;

describe("Delete Category Service", () => {
  beforeAll(() => {
    categoriesRepository = new InMemoryCategoriesRepository();
    deleteCategoryService = new DeleteCategoryService(categoriesRepository);
  });

  it("Should be able to delete a category", async () => {
    const category = Category.create(
      {
        name: "MiniPizzas",
      },
      "abcde"
    );

    await categoriesRepository.save(category);

    const service = await deleteCategoryService.execute(category.id);

    expect(await categoriesRepository.exists(category.id)).toBeFalsy();
    expect((await categoriesRepository.getAll()).length).toBe(0);
  });
});
