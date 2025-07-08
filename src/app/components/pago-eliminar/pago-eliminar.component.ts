import { Component, Inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { PagoService } from "../../services/pago.service"
import { ErrorHandlerService } from "../../services/error-handler.service"
import { Pago } from "../../models/pago"

@Component({
  selector: "app-pago-eliminar",
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
          ¿Está seguro que desea eliminar el pago 
          <strong>{{data.tipoPago}} - {{data.tipoComprobante}}</strong>?
        </p>
        <p class="dialog-detail">
          Banco: <strong>{{data.bancoPago}}</strong> <br />
          Monto: <strong>S/ {{data.montoPago.toFixed(2)}}</strong> <br />
          Fecha: <strong>{{data.fechaPago | date:'mediumDate'}}</strong> <br />
          Cliente: <strong>{{data.contrato.contratante.nombres}} {{data.contrato.contratante.apellidoPaterno}}</strong>
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
export class PagoEliminarComponent {
  eliminando = false

  constructor(
    public dialogRef: MatDialogRef<PagoEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Pago,
    private pagoService: PagoService,
    private errorHandler: ErrorHandlerService
  ) {}

  onNoClick(): void {
    this.dialogRef.close()
  }

  eliminar(): void {
    this.eliminando = true
    this.pagoService.eliminar(this.data.idPago).subscribe({
      next: () => {
        this.errorHandler.showSuccess("Pago eliminado correctamente")
        this.dialogRef.close(true)
      },
      error: (error: any) => {
        this.errorHandler.handleError(error)
        this.eliminando = false
      },
    })
  }
}
