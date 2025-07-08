import { Component, Inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { ReservaService } from "../../services/reserva.service"
import { ErrorHandlerService } from "../../services/error-handler.service"
import { Reserva } from "../../models/reserva"

@Component({
  selector: "app-reserva-eliminar",
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <div class="warning-icon">
          <mat-icon>warning</mat-icon>
        </div>
        <h2 class="dialog-title">Confirmar Eliminación</h2>
      </div>
      
      <div class="dialog-content">
        <p class="dialog-message">
          ¿Está seguro que desea eliminar esta reserva?
        </p>
        <p class="dialog-detail">
          "{{data.detalleReserva.substring(0, 100)}}{{data.detalleReserva.length > 100 ? '...' : ''}}"
        </p>
        <p class="dialog-warning">
          Fecha de reserva: {{ data.fechaReserva | date:'medium' }}
        </p>
        <p class="dialog-warning">Esta acción no se puede deshacer.</p>
      </div>
      
      <div class="dialog-actions">
        <button mat-button (click)="onNoClick()" class="cancel-button">
          <mat-icon>close</mat-icon>
          Cancelar
        </button>
        <button mat-raised-button color="warn" (click)="eliminar()" [disabled]="eliminando" class="delete-button">
          <mat-icon>{{eliminando ? 'hourglass_empty' : 'delete'}}</mat-icon>
          {{eliminando ? 'Eliminando...' : 'Eliminar'}}
        </button>
      </div>
    </div>
  `,
  styleUrls: ["../shared-dialog.component.css"],
})
export class ReservaEliminarComponent {
  eliminando = false

  constructor(
    public dialogRef: MatDialogRef<ReservaEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Reserva,
    private reservaService: ReservaService,
    private errorHandler: ErrorHandlerService
  ) {}

  onNoClick(): void {
    this.dialogRef.close()
  }

  eliminar(): void {
    this.eliminando = true
    this.reservaService.eliminar(this.data.idReserva).subscribe({
      next: () => {
        this.errorHandler.showSuccess("Reserva eliminada correctamente")
        this.dialogRef.close(true)
      },
      error: (error: any) => {
        this.errorHandler.handleError(error)
        this.eliminando = false
      },
    })
  }
}
