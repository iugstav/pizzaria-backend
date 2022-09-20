import { prismaClient } from "../../../../database/prisma";
import { OrderItem } from "../../Orderitem";
import { IOrderItemsRepository } from "../IOrderItems.repository";

export class PrismaOrderItemsRepository implements IOrderItemsRepository {
  public constructor() {}

  public async save({ id, properties }: OrderItem): Promise<void> {
    await prismaClient.orderItems.create({
      data: {
        id,
        pizza_id: properties.pizza_id,
        order_id: properties.order_id,
        amount: properties.amount,
        customization: properties.customization,
      },
    });

    return;
  }

  public async getAllFromAnOrder(orderId: string): Promise<OrderItem[]> {
    const orderItems = await prismaClient.orderItems.findMany({
      where: {
        order_id: orderId,
      },
    });

    if (orderItems.length === 0) {
      throw new Error("Id do pedido inválido.");
    }

    return orderItems.map((orderItem) =>
      OrderItem.create(
        {
          pizza_id: orderItem.pizza_id,
          order_id: orderItem.order_id,
          amount: orderItem.amount,
          customization: orderItem.customization,
        },
        orderItem.id
      )
    );
  }

  public async getById(id: string): Promise<OrderItem> {
    const orderItem = await prismaClient.orderItems.findUnique({
      where: {
        id,
      },
    });

    if (!orderItem) {
      throw new Error("Item do pedido não encontrado.");
    }

    return OrderItem.create(
      {
        pizza_id: orderItem.pizza_id,
        order_id: orderItem.order_id,
        amount: orderItem.amount,
        customization: orderItem.customization,
      },
      orderItem.id
    );
  }
}
