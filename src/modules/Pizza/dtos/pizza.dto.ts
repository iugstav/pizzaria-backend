export interface PizzaDTO {
  name: string;
  price: number;
  category: string;
  description?: string | null;
  created_at: Date;
}
