import { Order } from "../Order";
import { InMemoryOrdersRepository } from "../repositories/implementations/in-memory/InMemoryOrders.repository";
import { GetAllOrdersService } from "./GetAllOrders.service";

let ordersRepository: InMemoryOrdersRepository;
let getAllOrdersService: GetAllOrdersService;

describe("Get All Orders service", () => {
  beforeAll(() => {
    ordersRepository = new InMemoryOrdersRepository();
    getAllOrdersService = new GetAllOrdersService(ordersRepository);
  });

  it("Should be able to get all stored orders", async () => {
    const order1 = Order.create(
      {
        order_status: 0,
        total_price: 60.0,
        payment_type: "money",
        order_items: [],
        delivered_date: null,
        created_at: new Date(),
      },
      "order123"
    );

    const order2 = Order.create(
      {
        order_status: 0,
        total_price: 30.0,
        payment_type: "money",
        order_items: [],
        delivered_date: null,
        created_at: new Date(),
      },
      "order456"
    );

    await ordersRepository.save(order1);
    await ordersRepository.save(order2);

    const service = await getAllOrdersService.execute();

    expect(service.length).toBe(2);
    expect(service[0].id).toEqual("order123");
  });
});
