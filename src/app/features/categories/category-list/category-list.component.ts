import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TransactionService } from '../../../core/services/transaction.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent {
  readonly categoryService = inject(CategoryService);
  private transactionService = inject(TransactionService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  newName = '';
  newColor = '#4CAF50';
  editingId: string | null = null;
  editName = '';
  editColor = '';
  error = '';

  startEdit(cat: Category): void {
    this.editingId = cat.id;
    this.editName = cat.name;
    this.editColor = cat.color;
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
    if (this.categoryService.nameExists(name, this.editingId!)) {
      this.error = 'Categoria já existe'; return;
    }
    this.categoryService.update(this.editingId!, name, this.editColor);
    this.editingId = null;
    this.snack.open('Categoria atualizada!', 'OK', { duration: 2000 });
  }

  addCategory(): void {
    const name = this.newName.trim();
    this.error = '';
    if (!name) { this.error = 'Nome obrigatório'; return; }
    if (name.length > 50) { this.error = 'Máximo 50 caracteres'; return; }
    if (this.categoryService.nameExists(name)) {
      this.error = 'Categoria já existe'; return;
    }
    this.categoryService.add(name, this.newColor);
    this.newName = '';
    this.newColor = '#4CAF50';
    this.snack.open('Categoria criada!', 'OK', { duration: 2000 });
  }

  confirmDelete(cat: Category): void {
    const cats = this.categoryService.categories();
    if (cats.length <= 1) {
      this.snack.open('É necessário manter ao menos uma categoria.', 'OK', { duration: 3000 });
      return;
    }
    const count = this.transactionService.transactions().filter((t) => t.categoryId === cat.id).length;
    const msg = count > 0
      ? `Excluir "${cat.name}"? Ela está vinculada a ${count} transação(ões) que ficarão sem categoria.`
      : `Excluir a categoria "${cat.name}"?`;

    this.dialog.open(ConfirmDialogComponent, { data: { message: msg }, width: '400px' })
      .afterClosed()
      .subscribe((ok) => {
        if (ok) {
          this.categoryService.remove(cat.id);
          this.snack.open('Categoria excluída!', 'OK', { duration: 2000 });
        }
      });
  }
}
