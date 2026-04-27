import { Injectable, signal, computed, inject } from '@angular/core';
import { Transaction, TransactionType } from '../models/transaction.model';
import { StorageService } from './storage.service';
import { SettingsService } from './settings.service';
import { CategoryService } from './category.service';

const STORAGE_KEY = 'fp_transactions';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private settings = inject(SettingsService);
  readonly transactions = signal<Transaction[]>([]);

  readonly balance = computed(() => {
    const txBalance = this.transactions().reduce((sum, t) => {
      if (t.type === 'receita') return sum + t.value;
      return sum - t.value; // despesa e objetivo subtraem
    }, 0);
    return this.settings.initialBalance() + txBalance;
  });

  constructor(private storage: StorageService, private categoryService: CategoryService) {
    let items = this.storage.getAll<Transaction>(STORAGE_KEY);

    // Migra lançamentos antigos do tipo 'transferencia' para despesa + categoria Transferência
    const transferenciaId = categoryService.categories()
      .find((c) => c.name.toLowerCase() === 'transferência')?.id ?? null;
    let migrated = false;
    items = items.map((t) => {
      const raw = t as any;
      const needsTransferMigration = raw.type === 'transferencia';
      const needsObjectiveMigration = !('objectiveId' in raw);
      if (!needsTransferMigration && !needsObjectiveMigration) return t;
      migrated = true;
      return {
        ...t,
        ...(needsTransferMigration ? { type: 'despesa' as TransactionType, categoryId: transferenciaId } : {}),
        objectiveId: raw.objectiveId ?? null,
      };
    });
    if (migrated) this.storage.save(STORAGE_KEY, items);

    this.transactions.set(items.sort((a, b) => b.date.localeCompare(a.date)));
  }

  add(data: Omit<Transaction, 'id' | 'createdAt'>): void {
    const t: Transaction = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    const items = [t, ...this.transactions()];
    this.storage.save(STORAGE_KEY, items);
    this.transactions.set(items);
  }

  getById(id: string): Transaction | undefined {
    return this.transactions().find((t) => t.id === id);
  }

  update(id: string, data: Omit<Transaction, 'id' | 'createdAt'>): void {
    const items = this.transactions().map((t) =>
      t.id === id ? { ...t, ...data } : t
    );
    this.storage.save(STORAGE_KEY, items);
    this.transactions.set(items);
  }

  remove(id: string): void {
    const items = this.transactions().filter((t) => t.id !== id);
    this.storage.save(STORAGE_KEY, items);
    this.transactions.set(items);
  }

  removeAll(): void {
    this.storage.save(STORAGE_KEY, []);
    this.transactions.set([]);
  }

  addMany(items: Omit<Transaction, 'id' | 'createdAt'>[]): void {
    const newItems: Transaction[] = items.map((data) => ({
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }));
    const all = [...newItems, ...this.transactions()].sort((a, b) => b.date.localeCompare(a.date));
    this.storage.save(STORAGE_KEY, all);
    this.transactions.set(all);
  }

  getFiltered(type?: TransactionType | 'all', year?: number, month?: number): Transaction[] {
    return this.transactions().filter((t) => {
      const matchType = !type || type === 'all' || t.type === type;
      const d = new Date(t.date + 'T00:00:00');
      const matchYear = year == null || d.getFullYear() === year;
      const matchMonth = month == null || d.getMonth() + 1 === month;
      return matchType && matchYear && matchMonth;
    });
  }

  getMonthlyData(months = 6): { label: string; receitas: number; despesas: number; objetivos: number }[] {
    const result = [];
    const now = new Date();
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const label = d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      const slice = this.getFiltered('all', year, month);
      result.push({
        label,
        receitas: slice.filter((t) => t.type === 'receita').reduce((s, t) => s + t.value, 0),
        despesas: slice.filter((t) => t.type === 'despesa').reduce((s, t) => s + t.value, 0),
        objetivos: slice.filter((t) => t.type === 'objetivo').reduce((s, t) => s + t.value, 0),
      });
    }
    return result;
  }

  getCurrentMonthExpensesByCategory(): { categoryId: string; total: number }[] {
    const now = new Date();
    const slice = this.getFiltered('despesa', now.getFullYear(), now.getMonth() + 1);
    const map = new Map<string, number>();
    for (const t of slice) {
      const key = t.categoryId ?? 'sem-categoria';
      map.set(key, (map.get(key) ?? 0) + t.value);
    }
    return Array.from(map.entries()).map(([categoryId, total]) => ({ categoryId, total }));
  }

  getCurrentMonthReceiptsByCategory(): { categoryId: string; total: number }[] {
    const now = new Date();
    const slice = this.getFiltered('receita', now.getFullYear(), now.getMonth() + 1);
    const map = new Map<string, number>();
    for (const t of slice) {
      const key = t.categoryId ?? 'sem-categoria';
      map.set(key, (map.get(key) ?? 0) + t.value);
    }
    return Array.from(map.entries()).map(([categoryId, total]) => ({ categoryId, total }));
  }

  getBalanceEvolution(months = 12): { label: string; balance: number }[] {
    const now = new Date();
    const windowStart = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

    // Saldo acumulado antes da janela
    let running = this.settings.initialBalance();
    for (const t of this.transactions()) {
      const d = new Date(t.date + 'T00:00:00');
      if (d < windowStart) {
        running += t.type === 'receita' ? t.value : -t.value;
      }
    }

    // Percorre cada mês da janela em ordem cronológica
    const result: { label: string; balance: number }[] = [];
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      const slice = this.getFiltered('all', d.getFullYear(), d.getMonth() + 1);
      for (const t of slice) {
        running += t.type === 'receita' ? t.value : -t.value;
      }
      result.push({ label, balance: running });
    }
    return result;
  }
}
