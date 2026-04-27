import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Confirmar</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button (click)="ref.close(false)">Cancelar</button>
      <button mat-flat-button color="warn" (click)="ref.close(true)">Confirmar</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  ref = inject(MatDialogRef<ConfirmDialogComponent>);
  data = inject<{ message: string }>(MAT_DIALOG_DATA);
}
