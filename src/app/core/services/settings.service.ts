import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'fp_settings';

interface AppSettings {
  initialBalance: number;
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly _initialBalance = signal<number>(0);
  readonly initialBalance = this._initialBalance.asReadonly();

  constructor() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const settings: AppSettings = JSON.parse(stored);
        this._initialBalance.set(settings.initialBalance ?? 0);
      }
    } catch {
      // ignore parse errors
    }
  }

  setInitialBalance(value: number): void {
    this._initialBalance.set(value);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ initialBalance: value }));
  }
}
