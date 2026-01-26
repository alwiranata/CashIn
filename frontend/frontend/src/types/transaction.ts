export type TypeTransaction = "INCOME" | "EXPENSE";

export interface Transaction {
  id: number;
  nameTransaction: string;
  price: number;
  typeTransaction: TypeTransaction;
  image?: string;
}
