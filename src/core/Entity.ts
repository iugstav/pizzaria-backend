import crypto from "crypto";

export abstract class Entity<T> {
  protected readonly _id: string;
  public properties: T;

  get id() {
    return this._id;
  }

  constructor(props: T, id?: string) {
    this._id = id || crypto.randomUUID();
    this.properties = props;
  }
}
