import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TransactionService } from '../../../core/services/transaction.service';
import { CategoryService } from '../../../core/services/category.service';
import { ObjectiveService } from '../../../core/services/objective.service';
import { Transaction, TransactionType } from '../../../core/models/transaction.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogModule,
    MatChipsModule,
    MatTooltipModule,
    FormsModule,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss',
})
export class TransactionListComponent {
  private transactionService = inject(TransactionService);
  readonly categoryService = inject(CategoryService);
  readonly objectiveService = inject(ObjectiveService);
  private dialog = inject(MatDialog);

  filterType: TransactionType | 'all' = 'all';
  filterMonth: number = new Date().getMonth() + 1;
  filterYear: number = new Date().getFullYear();

  readonly columns = ['date', 'type', 'category', 'description', 'value', 'actions'];

  readonly months = [
    { v: 1, l: 'Janeiro' }, { v: 2, l: 'Fevereiro' }, { v: 3, l: 'Março' },
    { v: 4, l: 'Abril' }, { v: 5, l: 'Maio' }, { v: 6, l: 'Junho' },
    { v: 7, l: 'Julho' }, { v: 8, l: 'Agosto' }, { v: 9, l: 'Setembro' },
    { v: 10, l: 'Outubro' }, { v: 11, l: 'Novembro' }, { v: 12, l: 'Dezembro' },
  ];

  get years(): number[] {
    const cur = new Date().getFullYear();
    return [cur - 2, cur - 1, cur, cur + 1];
  }

  get filtered(): Transaction[] {
    return this.transactionService.getFiltered(this.filterType, this.filterYear, this.filterMonth);
  }

  typeLabel(type: TransactionType): string {
    const map: Record<TransactionType, string> = { receita: 'Receita', despesa: 'Despesa', objetivo: 'Objetivo' };
    return map[type] ?? type;
  }

  getLabelName(t: Transaction): string {
    if (t.type === 'objetivo') {
      if (!t.objectiveId) return '—';
      return this.objectiveService.getById(t.objectiveId)?.name ?? '—';
    }
    if (!t.categoryId) return '—';
    return this.categoryService.getById(t.categoryId)?.name ?? '—';
  }

  getLabelColor(t: Transaction): string {
    if (t.type === 'objetivo') {
      if (!t.objectiveId) return '#ccc';
      return this.objectiveService.getById(t.objectiveId)?.color ?? '#ccc';
    }
    if (!t.categoryId) return '#ccc';
    return this.categoryService.getById(t.categoryId)?.color ?? '#ccc';
  }

  confirmDelete(t: Transaction): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Excluir a transação de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.value)}?` },
      width: '360px',
    });
    ref.afterClosed().subscribe((ok) => {
      if (ok) this.transactionService.remove(t.id);
    });
  }
}
