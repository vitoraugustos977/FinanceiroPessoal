import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TransactionService } from '../../../core/services/transaction.service';
import { CategoryService } from '../../../core/services/category.service';
import { ObjectiveService } from '../../../core/services/objective.service';
import { TransactionType } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.scss',
})
export class TransactionFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private transactionService = inject(TransactionService);
  readonly categoryService = inject(CategoryService);
  readonly objectiveService = inject(ObjectiveService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snack = inject(MatSnackBar);

  today = new Date();
  editId: string | null = null;

  get isEditMode(): boolean {
    return this.editId !== null;
  }

  get isObjetivo(): boolean {
    return this.form.value.type === 'objetivo';
  }

  form = this.fb.group({
    type: ['despesa' as TransactionType, Validators.required],
    value: [null as number | null, [Validators.required, Validators.min(0.01)]],
    date: [this.today, Validators.required],
    categoryId: [null as string | null],
    objectiveId: [null as string | null],
    description: [''],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const transaction = this.transactionService.getById(id);
      if (transaction) {
        this.editId = id;
        this.form.patchValue({
          type: transaction.type,
          value: transaction.value,
          date: new Date(transaction.date + 'T00:00:00'),
          categoryId: transaction.categoryId,
          objectiveId: transaction.objectiveId,
          description: transaction.description,
        });
      } else {
        this.router.navigate(['/transactions']);
      }
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const data = {
      type: v.type as TransactionType,
      value: v.value!,
      date: this.toISODate(v.date as Date),
      categoryId: this.isObjetivo ? null : (v.categoryId ?? null),
      objectiveId: this.isObjetivo ? (v.objectiveId ?? null) : null,
      description: v.description ?? '',
    };

    if (this.isEditMode) {
      this.transactionService.update(this.editId!, data);
      this.snack.open('Transação atualizada com sucesso!', 'OK', { duration: 2000 });
      this.router.navigate(['/transactions']);
    } else {
      this.transactionService.add(data);
      this.snack.open('Transação lançada com sucesso!', 'OK', { duration: 2000 });
      this.router.navigate(['/dashboard']);
    }
  }

  cancel(): void {
    this.router.navigate(['/transactions']);
  }

  private toISODate(d: Date): string {
    return d.toISOString().split('T')[0];
  }
}
