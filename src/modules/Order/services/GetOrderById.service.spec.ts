import { Order } from "../Order";
import { InMemoryOrdersRepository } from "../repositories/implementations/in-memory/InMemoryOrders.repository";
import { GetOrderByIdService } from "./GetOrderById.service";

let ordersRepository: InMemoryOrdersRepository;
let getOrderByIdService: GetOrderByIdService;

describe("Get Order By Id service", () => {
  beforeAll(() => {
    ordersRepository = new InMemoryOrdersRepository();
    getOrderByIdService = new GetOrderByIdService(ordersRepository);
  });

  it("Should be able to retrieve an order by it's id", async () => {
    const order = Order.create(
      {
        order_status: 0,
        total_price: 60.0,
        payment_type: "money",
        delivered_date: null,
        order_items: [],
        created_at: new Date(),
      },
      "order123"
    );

    await ordersRepository.save(order);

    await expect(getOrderByIdService.execute(order.id)).resolves.toEqual(order);
  });

  it("Should not be able to retrieve an order by it's id with invalid id", async () => {
    const order = Order.create(
      {
        order_status: 0,
        total_price: 60.0,
        payment_type: "money",
        delivered_date: null,
        order_items: [],
        created_at: new Date(),
      },
      "order456"
    );

    await ordersRepository.save(order);

    await expect(getOrderByIdService.execute("random_order")).rejects.toEqual(
      new Error("Pedido inválido")
    );
  });
});
