export type TransactionType = 'receita' | 'despesa' | 'objetivo';

export interface Transaction {
  id: string;
  type: TransactionType;
  value: number;
  date: string;
  categoryId: string | null;
  objectiveId: string | null;
  description: string;
  createdAt: string;
}
