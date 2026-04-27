import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ObjectiveService } from '../../../core/services/objective.service';
import { Objective } from '../../../core/models/objective.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TransactionService } from '../../../core/services/transaction.service';

@Component({
  selector: 'app-objective-list',
  standalone: true,
  imports: [
    FormsModule,
    CurrencyPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './objective-list.component.html',
  styleUrl: './objective-list.component.scss',
})
export class ObjectiveListComponent {
  readonly objectiveService = inject(ObjectiveService);
  private transactionService = inject(TransactionService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  newName = '';
  newColor = '#3949ab';
  newTarget: number | null = null;
  editingId: string | null = null;
  editName = '';
  editColor = '';
  editTarget: number | null = null;
  error = '';

  startEdit(obj: Objective): void {
    this.editingId = obj.id;
    this.editName = obj.name;
    this.editColor = obj.color;
    this.editTarget = obj.targetValue;
    this.error = '';
  }

  cancelEdit(): void {
    this.editingId = null;
    this.error = '';
  }

  saveEdit(): void {
    const name = this.editName.trim();
    if (!name) { this.error = 'Nome obrigatório'; return; }
    if (name.length > 50) { this.error = 'Máximo 50 caracteres'; return; }
    if (this.objectiveService.nameExists(name, this.editingId!)) { this.error = 'Objetivo já existe'; return; }
    if (!this.editTarget || this.editTarget <= 0) { this.error = 'Meta deve ser maior que zero'; return; }
    this.objectiveService.update(this.editingId!, name, this.editColor, this.editTarget);
    this.editingId = null;
    this.snack.open('Objetivo atualizado!', 'OK', { duration: 2000 });
  }

  addObjective(): void {
    const name = this.newName.trim();
    this.error = '';
    if (!name) { this.error = 'Nome obrigatório'; return; }
    if (name.length > 50) { this.error = 'Máximo 50 caracteres'; return; }
    if (this.objectiveService.nameExists(name)) { this.error = 'Objetivo já existe'; return; }
    if (!this.newTarget || this.newTarget <= 0) { this.error = 'Meta deve ser maior que zero'; return; }
    this.objectiveService.add(name, this.newColor, this.newTarget);
    this.newName = '';
    this.newColor = '#3949ab';
    this.newTarget = null;
    this.snack.open('Objetivo criado!', 'OK', { duration: 2000 });
  }

  confirmDelete(obj: Objective): void {
    const count = this.transactionService.transactions().filter((t) => t.objectiveId === obj.id).length;
    const msg = count > 0
      ? `Excluir "${obj.name}"? Ele está vinculado a ${count} lançamento(s) que ficarão sem objetivo.`
      : `Excluir o objetivo "${obj.name}"?`;

    this.dialog.open(ConfirmDialogComponent, { data: { message: msg }, width: '400px' })
      .afterClosed()
      .subscribe((ok) => {
        if (ok) {
          this.objectiveService.remove(obj.id);
          this.snack.open('Objetivo excluído!', 'OK', { duration: 2000 });
        }
      });
  }
}
