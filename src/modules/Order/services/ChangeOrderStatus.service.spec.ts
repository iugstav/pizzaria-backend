import { Order } from "../Order";
import { InMemoryOrdersRepository } from "../repositories/implementations/in-memory/InMemoryOrders.repository";
import { ChangeOrderStatusService } from "./ChangeOrderStatus.service";

let ordersRepository: InMemoryOrdersRepository;
let changeOrderStatusService: ChangeOrderStatusService;

describe("Change Order Status service", () => {
  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository();
    changeOrderStatusService = new ChangeOrderStatusService(ordersRepository);
  });

  it("Should be able to change the order status of an order", async () => {
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
    const newOrderStatus = 2;

    await ordersRepository.save(order);

    await changeOrderStatusService.execute({
      orderId: order.id,
      newOrderStatus,
    });

    expect(
      (await ordersRepository.getById(order.id)).properties.order_status
    ).toBe(2);
  });

  it("Should not be able to change the order status with invalid new order status", async () => {
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
    const newOrderStatus = 5;

    await ordersRepository.save(order);

    await expect(
      changeOrderStatusService.execute({
        orderId: order.id,
        newOrderStatus,
      })
    ).rejects.toEqual(new Error("Invalid order status"));
  });

  it("Should not be able to change the order status of a non-existent order", async () => {
    const newOrderStatus = 2;

    await expect(
      changeOrderStatusService.execute({
        orderId: "112233",
        newOrderStatus,
      })
    ).rejects.toEqual(new Error("Order does not exist"));
  });
});
