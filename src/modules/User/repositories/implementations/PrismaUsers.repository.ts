import { prismaClient } from "../../../../database/prisma";
import { Role, RoleType, User } from "../../User";
import { IUsersRepository } from "../IUsers.repository";

export class PrismaUsersRepository implements IUsersRepository {
  public constructor() {}

  public async create({ id, properties }: User): Promise<void> {
    const { address } = properties;

    const addressAlreadyExists = await prismaClient.addresses.findFirst({
      where: {
        address1: address.address1,
        number: address.number,
        state: address.state,
      },
    });

    if (!addressAlreadyExists) {
      await prismaClient.addresses.create({
        data: {
          id: address.id,
          address1: address.address1,
          address2: address.address2 ?? null,
          number: address.number,
          state: address.state,
          complement: address.complement ?? null,

          users: {
            create: {
              id,
              first_name: properties.firstName,
              last_name: properties.lastName,
              email: properties.email,
              password: properties.password,
              phone: properties.phone,
              role: properties.role,
            },
          },
        },
      });

      return;
    }

    await prismaClient.users.create({
      data: {
        id,
        first_name: properties.firstName,
        last_name: properties.lastName,
        email: properties.email,
        password: properties.password,
        phone: properties.phone,
        role: properties.role,
        address_id: addressAlreadyExists.id,
      },
    });

    return;
  }

  public async findByEmail(email: string): Promise<User> {
    const userInPersistence = await prismaClient.users.findUnique({
      where: { email },
      include: {
        addresses: true,
        orders: true,
      },
    });

    if (!userInPersistence) {
      throw new Error("Invalid user email");
    }

    const { addresses } = userInPersistence;

    if (!addresses) {
      throw new Error("invalid user address");
    }

    const persistenceRole =
      userInPersistence.role === "CUSTOMER" ? "Customer" : "Admin";

    const user = User.create(
      {
        firstName: userInPersistence.first_name,
        lastName: userInPersistence.last_name,
        email: userInPersistence.email,
        password: userInPersistence.password,
        phone: userInPersistence.phone,
        address: {
          id: addresses.id,
          address1: addresses.address1,
          address2: addresses.address2 ?? "",
          number: addresses.number,
          state: addresses.state,
          complement: addresses.complement ?? "",
        },
        role: Role[persistenceRole],
      },
      userInPersistence.id
    );

    return user;
  }

  public async exists(email: string): Promise<boolean> {
    const userExists = await prismaClient.users.findUnique({
      where: { email },
    });

    return !!userExists;
  }
}
