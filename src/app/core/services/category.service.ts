import { Injectable, signal } from '@angular/core';
import { Category, DEFAULT_CATEGORIES } from '../models/category.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'fp_categories';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  readonly categories = signal<Category[]>([]);

  constructor(private storage: StorageService) {
    this.load();
  }

  private load(): void {
    let items = this.storage.getAll<Category>(STORAGE_KEY);
    if (items.length === 0) {
      items = DEFAULT_CATEGORIES.map((c) => ({ ...c, id: crypto.randomUUID() }));
      this.storage.save(STORAGE_KEY, items);
    } else if (!items.some((c) => c.name.toLowerCase() === 'transferência')) {
      items = [...items, { id: crypto.randomUUID(), name: 'Transferência', color: '#1565c0' }];
      this.storage.save(STORAGE_KEY, items);
    }
    this.categories.set(items);
  }

  add(name: string, color: string): void {
    const items = [...this.categories(), { id: crypto.randomUUID(), name, color }];
    this.storage.save(STORAGE_KEY, items);
    this.categories.set(items);
  }

  update(id: string, name: string, color: string): void {
    const items = this.categories().map((c) => (c.id === id ? { ...c, name, color } : c));
    this.storage.save(STORAGE_KEY, items);
    this.categories.set(items);
  }

  remove(id: string): void {
    const items = this.categories().filter((c) => c.id !== id);
    this.storage.save(STORAGE_KEY, items);
    this.categories.set(items);
  }

  getById(id: string): Category | undefined {
    return this.categories().find((c) => c.id === id);
  }

  nameExists(name: string, excludeId?: string): boolean {
    return this.categories().some(
      (c) => c.name.toLowerCase() === name.toLowerCase() && c.id !== excludeId
    );
  }
}
