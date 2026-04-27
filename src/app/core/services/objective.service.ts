import { Injectable, signal } from '@angular/core';
import { Objective } from '../models/objective.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'fp_objectives';

@Injectable({ providedIn: 'root' })
export class ObjectiveService {
  readonly objectives = signal<Objective[]>([]);

  constructor(private storage: StorageService) {
    const items = this.storage.getAll<Objective>(STORAGE_KEY);
    this.objectives.set(items);
  }

  add(name: string, color: string, targetValue: number): void {
    const items = [...this.objectives(), { id: crypto.randomUUID(), name, color, targetValue }];
    this.storage.save(STORAGE_KEY, items);
    this.objectives.set(items);
  }

  update(id: string, name: string, color: string, targetValue: number): void {
    const items = this.objectives().map((o) => (o.id === id ? { ...o, name, color, targetValue } : o));
    this.storage.save(STORAGE_KEY, items);
    this.objectives.set(items);
  }

  remove(id: string): void {
    const items = this.objectives().filter((o) => o.id !== id);
    this.storage.save(STORAGE_KEY, items);
    this.objectives.set(items);
  }

  getById(id: string): Objective | undefined {
    return this.objectives().find((o) => o.id === id);
  }

  nameExists(name: string, excludeId?: string): boolean {
    return this.objectives().some(
      (o) => o.name.toLowerCase() === name.toLowerCase() && o.id !== excludeId
    );
  }
}
