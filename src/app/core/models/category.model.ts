export interface Category {
  id: string;
  name: string;
  color: string;
}

export const DEFAULT_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'Alimentação', color: '#FF7043' },
  { name: 'Transporte', color: '#42A5F5' },
  { name: 'Moradia', color: '#66BB6A' },
  { name: 'Saúde', color: '#AB47BC' },
  { name: 'Lazer', color: '#FFCA28' },
  { name: 'Educação', color: '#26C6DA' },
  { name: 'Vestuário', color: '#EC407A' },
  { name: 'Transferência', color: '#1565c0' },
  { name: 'Outros', color: '#78909C' },
];
