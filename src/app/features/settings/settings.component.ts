import { Component, inject, computed, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TransactionService } from '../../core/services/transaction.service';
import { SettingsService } from '../../core/services/settings.service';
import { CategoryService } from '../../core/services/category.service';
import { ObjectiveService } from '../../core/services/objective.service';
import { Transaction } from '../../core/models/transaction.model';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

type TxInput = Omit<Transaction, 'id' | 'createdAt'>;

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  private transactionService = inject(TransactionService);
  private settingsService = inject(SettingsService);
  private categoryService = inject(CategoryService);
  private objectiveService = inject(ObjectiveService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  readonly hasTransactions = computed(() => this.transactionService.transactions().length > 0);

  balanceForm = this.fb.group({
    initialBalance: [
      this.settingsService.initialBalance(),
      [Validators.required, Validators.min(0)],
    ],
  });

  ngOnInit(): void {
    this.syncFieldState();
  }

  private syncFieldState(): void {
    const ctrl = this.balanceForm.get('initialBalance')!;
    if (this.hasTransactions()) {
      ctrl.disable();
    } else {
      ctrl.enable();
    }
  }

  saveInitialBalance(): void {
    if (this.balanceForm.invalid || this.hasTransactions()) return;
    const value = this.balanceForm.get('initialBalance')?.value ?? 0;
    this.settingsService.setInitialBalance(value);
    this.snack.open('Saldo inicial salvo com sucesso!', 'OK', { duration: 2500 });
  }

  confirmDeleteAll(): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Tem certeza que deseja excluir TODOS os lançamentos? Esta ação não pode ser desfeita.' },
      width: '400px',
    });
    ref.afterClosed().subscribe((ok) => {
      if (ok) {
        this.transactionService.removeAll();
        this.balanceForm.get('initialBalance')!.enable();
        this.snack.open('Todos os lançamentos foram excluídos.', 'OK', { duration: 3000 });
      }
    });
  }

  confirmSeedData(): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message:
          'Isso irá adicionar ~55 lançamentos de exemplo (Jan–Mar 2026) ao seu histórico. ' +
          'Se não houver objetivos cadastrados, 3 objetivos de exemplo serão criados. Deseja continuar?',
      },
      width: '440px',
    });
    ref.afterClosed().subscribe((ok) => {
      if (ok) this.generateSeedData();
    });
  }

  private generateSeedData(): void {
    // Garante que existem objetivos (cria exemplos se vazio)
    if (this.objectiveService.objectives().length === 0) {
      this.objectiveService.add('Reserva de Emergência', '#1565c0', 15000);
      this.objectiveService.add('Quitação de Dívida', '#c62828', 8000);
      this.objectiveService.add('Viagem de Férias', '#2e7d32', 5000);
    }
    const objectives = this.objectiveService.objectives();
    const obj0 = objectives[0] ?? null;
    const obj1 = objectives[1] ?? null;
    const obj2 = objectives[2] ?? null;

    const cats = this.categoryService.categories();
    const catId = (name: string) =>
      cats.find((c) => c.name.toLowerCase().includes(name.toLowerCase()))?.id ?? null;

    const mkDate = (month: number, day: number) =>
      `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const rec = (value: number, date: string, description: string): TxInput =>
      ({ type: 'receita', value, date, description, categoryId: null, objectiveId: null });

    const dep = (value: number, date: string, description: string, cat: string): TxInput =>
      ({ type: 'despesa', value, date, description, categoryId: catId(cat), objectiveId: null });

    const obj = (value: number, date: string, description: string, objId: string | null): TxInput =>
      ({ type: 'objetivo', value, date, description, categoryId: null, objectiveId: objId });

    const transactions: TxInput[] = [
      // ── Janeiro ──────────────────────────────────────────────────────────
      rec(5800,  mkDate(1,  5), 'Salário Janeiro'),
      rec(1200,  mkDate(1, 15), 'Freelance - Site institucional'),
      dep(1400,  mkDate(1,  5), 'Aluguel',                        'moradia'),
      dep( 320,  mkDate(1,  8), 'Supermercado Pão de Açúcar',     'alimentação'),
      dep(  85,  mkDate(1, 10), 'iFood - pedidos do mês',         'alimentação'),
      dep( 180,  mkDate(1, 12), 'Conta de luz + água',            'moradia'),
      dep(  95,  mkDate(1, 14), 'Gasolina',                       'transporte'),
      dep(  48,  mkDate(1, 15), 'Uber',                           'transporte'),
      dep( 150,  mkDate(1, 18), 'Farmácia',                       'saúde'),
      dep( 220,  mkDate(1, 20), 'Academia + plano de saúde',      'saúde'),
      dep(  60,  mkDate(1, 22), 'Netflix + Spotify',              'lazer'),
      dep( 130,  mkDate(1, 25), 'Cinema + jantar fora',           'lazer'),
      dep( 199,  mkDate(1, 26), 'Curso online - JavaScript',      'educação'),
      dep( 250,  mkDate(1, 28), 'Roupas de inverno',              'vestuário'),
      dep(  75,  mkDate(1, 30), 'Mercadinho local',               'alimentação'),
      ...(obj0 ? [obj(500, mkDate(1,  5), `Aporte - ${obj0.name}`, obj0.id)] : []),
      ...(obj1 ? [obj(300, mkDate(1, 10), `Aporte - ${obj1.name}`, obj1.id)] : []),

      // ── Fevereiro ─────────────────────────────────────────────────────────
      rec(5800,  mkDate(2,  5), 'Salário Fevereiro'),
      rec( 800,  mkDate(2, 20), 'Venda - itens usados'),
      dep(1400,  mkDate(2,  5), 'Aluguel',                        'moradia'),
      dep( 290,  mkDate(2,  7), 'Supermercado Extra',             'alimentação'),
      dep( 120,  mkDate(2,  9), 'iFood - pedidos do mês',         'alimentação'),
      dep( 175,  mkDate(2, 11), 'Conta de luz + água',            'moradia'),
      dep( 110,  mkDate(2, 13), 'Gasolina',                       'transporte'),
      dep(  65,  mkDate(2, 15), 'Uber',                           'transporte'),
      dep(  90,  mkDate(2, 16), 'Farmácia',                       'saúde'),
      dep( 220,  mkDate(2, 18), 'Academia + plano de saúde',      'saúde'),
      dep(  60,  mkDate(2, 20), 'Netflix + Spotify',              'lazer'),
      dep(  85,  mkDate(2, 22), 'Parque + sorvete',               'lazer'),
      dep( 350,  mkDate(2, 24), 'Passagem aérea - férias',        'transporte'),
      dep(  42,  mkDate(2, 26), 'Mercadinho local',               'alimentação'),
      dep( 189,  mkDate(2, 27), 'Livros técnicos',                'educação'),
      ...(obj0 ? [obj(500, mkDate(2,  5), `Aporte - ${obj0.name}`, obj0.id)] : []),
      ...(obj1 ? [obj(400, mkDate(2, 12), `Aporte - ${obj1.name}`, obj1.id)] : []),
      ...(obj2 ? [obj(200, mkDate(2, 20), `Aporte - ${obj2.name}`, obj2.id)] : []),

      // ── Março ─────────────────────────────────────────────────────────────
      rec(5800,  mkDate(3,  5), 'Salário Março'),
      rec(1500,  mkDate(3, 18), 'Bônus trimestral'),
      dep(1400,  mkDate(3,  5), 'Aluguel',                        'moradia'),
      dep( 370,  mkDate(3,  6), 'Supermercado Carrefour',         'alimentação'),
      dep(  95,  mkDate(3,  9), 'iFood - pedidos do mês',         'alimentação'),
      dep( 190,  mkDate(3, 11), 'Conta de luz + água',            'moradia'),
      dep( 120,  mkDate(3, 13), 'Gasolina',                       'transporte'),
      dep(  55,  mkDate(3, 15), 'Uber',                           'transporte'),
      dep( 200,  mkDate(3, 17), 'Dentista',                       'saúde'),
      dep( 220,  mkDate(3, 18), 'Academia + plano de saúde',      'saúde'),
      dep(  60,  mkDate(3, 20), 'Netflix + Spotify',              'lazer'),
      dep( 180,  mkDate(3, 22), 'Churrasco com amigos',           'lazer'),
      dep( 320,  mkDate(3, 24), 'Tênis novo + acessórios',        'vestuário'),
      dep(  65,  mkDate(3, 27), 'Mercadinho local',               'alimentação'),
      dep( 280,  mkDate(3, 28), 'Curso React + TypeScript',       'educação'),
      ...(obj0 ? [obj(700, mkDate(3,  5), `Aporte - ${obj0.name}`, obj0.id)] : []),
      ...(obj1 ? [obj(500, mkDate(3, 15), `Aporte - ${obj1.name}`, obj1.id)] : []),
      ...(obj2 ? [obj(300, mkDate(3, 20), `Aporte - ${obj2.name}`, obj2.id)] : []),
    ];

    this.transactionService.addMany(transactions);
    this.syncFieldState();
    this.snack.open(
      `✅ ${transactions.length} lançamentos gerados (Jan–Mar 2026)!`,
      'OK',
      { duration: 4000 }
    );
  }
}
