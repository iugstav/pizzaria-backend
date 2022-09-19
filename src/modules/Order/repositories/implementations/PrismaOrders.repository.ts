import { prismaClient } from "../../../../database/prisma";

import { Order } from "../../Order";
import { IOrdersRepository } from "../IOrders.repository";
import { OrderItem } from "../../../OrderItems/Orderitem";

export class PrismaOrdersRepository implements IOrdersRepository {
  public constructor() {}

  async save({ id, properties }: Order, user_id: string): Promise<void> {
    const mappedOrderItems = properties.order_items.map((orderItem) => {
      return {
        id: orderItem.id,
        amount: orderItem.properties.amount,
        customization: orderItem.properties.customization,
        pizza_id: orderItem.properties.pizza_id,
      };
    });

    await prismaClient.orders.create({
      data: {
        id: id,
        order_status: properties.order_status,
        payment_type: properties.payment_type,
        delivered_date: null,
        total_price: properties.total_price,
        created_at: properties.created_at,
        user_id,

        order_items: {
          createMany: {
            data: mappedOrderItems,
          },
        },
      },
    });
  }

  async getAll(): Promise<Order[]> {
    const orders = await prismaClient.orders.findMany();

    return orders.map((order) =>
      Order.create(
        {
          total_price: order.total_price as number,
          payment_type: order.payment_type,
          order_status: order.order_status,
          delivered_date: order.delivered_date,
          order_items: [],
          created_at: order.created_at,
        },
        order.id
      )
    );
  }

  async getById(id: string): Promise<Order> {
    const order = await prismaClient.orders.findUnique({
      where: { id },

      include: {
        order_items: {
          orderBy: {
            id: "asc",
          },
        },
      },
    });

    if (!order) {
      throw new Error("Pedido inválido");
    }

    const orderItems = order.order_items.map((orderItem) =>
      OrderItem.create(
        {
          order_id: orderItem.order_id,
          pizza_id: orderItem.pizza_id,
          amount: orderItem.amount,
          customization: orderItem.customization,
        },
        orderItem.id
      )
    );

    return Order.create(
      {
        total_price: order.total_price as number,
        payment_type: order.payment_type,
        order_status: order.order_status,
        order_items: orderItems,
        delivered_date: order.delivered_date,
        created_at: order.created_at,
      },
      order.id
    );
  }

  async changeOrderStatus(id: string, newOrderStatus: number): Promise<void> {
    await prismaClient.orders.update({
      data: {
        order_status: newOrderStatus,
      },
      where: {
        id,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prismaClient.orders.delete({
      where: {
        id,
      },
    });
  }

  async exists(id: string): Promise<boolean> {
    const orderExists = await prismaClient.orders.findUnique({
      where: {
        id,
      },
    });

    return orderExists ? true : false;
  }
}
