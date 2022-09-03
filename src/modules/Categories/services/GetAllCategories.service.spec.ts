import { Category } from "../Category";
import { ICategoriesRepository } from "../repositories/ICategories.repository";
import { InMemoryCategoriesRepository } from "../repositories/implementations/in-memory/InMemoryCategories.repository";
import { GetAllCategoriesService } from "./GetAllCategories.service";

let categoriesRepository: ICategoriesRepository;
let getAllCategoriesService: GetAllCategoriesService;

describe("Get All Categories service", () => {
  beforeAll(() => {
    categoriesRepository = new InMemoryCategoriesRepository();
    getAllCategoriesService = new GetAllCategoriesService(categoriesRepository);
  });

  it("Should be able to return all categories", async () => {
    const category1 = Category.create(
      {
        name: "Pizzas Doces",
      },
      "abcd"
    );

    const category2 = Category.create(
      {
        name: "Pizzas Vegetarianas",
      },
      "12345"
    );

    await categoriesRepository.save(category1);
    await categoriesRepository.save(category2);

    const service = await getAllCategoriesService.execute();

    expect(service.length).toBe(2);
    expect(service[0].id).toEqual("abcd");
    expect(service[1].id).toEqual("12345");
  });
});
