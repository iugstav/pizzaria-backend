import { Entity } from "../../core/Entity";
import { Order } from "../Order/Order";

export enum Role {
  Customer = "CUSTOMER",
  Admin = "ADMIN",
}

export type RoleType = keyof typeof Role;

export type Address = {
  id: string;
  address1: string;
  address2?: string;
  number: number;
  complement?: string;
  state: string;
};

type UserProps = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: Address;
  role: Role;

  orders?: Order[];
};

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  static create(props: UserProps, id?: string) {
    return new User(props, id);
  }
}
