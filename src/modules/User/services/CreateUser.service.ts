import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

import { IUsersRepository } from "../repositories/IUsers.repository";
import { Address, Role, RoleType, User } from "../User";

interface CreateUserServiceRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  address: Omit<Address, "id">;
}

const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const PHONE_REGEX = /(\(?\d{2}\)?\s)?(\d{4,5}\-\d{4})/;

export class CreateUserService {
  public constructor(private usersRepository: IUsersRepository) {}

  public async execute(data: CreateUserServiceRequest): Promise<User> {
    if (data.firstName.trim().length > 16 || data.lastName.trim().length > 16) {
      throw new Error("invalid parameter name. Name is too big");
    }

    if (data.email.trim().length > 255) {
      throw new Error("invalid parameter email. Email is too big");
    }

    if (!EMAIL_REGEX.test(data.email)) {
      throw new Error("invalid parameter email. Email does not match");
    }

    if (data.password.trim().length < 6 || data.password.trim().length > 70) {
      throw new Error("invalid parameter password. Invalid password size");
    }

    if (!PHONE_REGEX.test(data.phone)) {
      throw new Error("invalid parameter phone. Phone does not match");
    }

    const addressId = randomUUID();
    const userId = randomUUID();
    const hashedPassword = await bcrypt.hash(data.password, 8);
    const typedRole = data.role as RoleType;

    const { address1, address2, number, state, complement } = data.address;

    const user = User.create(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        address: {
          id: addressId,
          address1,
          address2,
          number,
          state,
          complement,
        },
        role: Role[typedRole], // "Customer" or "Admin"
      },
      userId
    );

    const userExistsInPersistence = await this.usersRepository.exists(
      user.properties.email
    );

    if (userExistsInPersistence) {
      throw new Error("An user already owns this email. Please insert another");
    }

    await this.usersRepository.create(user);

    return user;
  }
}
