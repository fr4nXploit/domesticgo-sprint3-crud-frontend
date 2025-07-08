import { Component, Inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { Notificacion } from "../../models/notificacion"
import { NotificacionService } from "../../services/notificacion.service"
import { ErrorHandlerService } from "../../services/error-handler.service"

@Component({
  selector: "app-notificacion-eliminar",
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
          ¿Está seguro que desea eliminar la notificación 
          <strong>#{{data.idNotificacion}}</strong>?
        </p>
        <p class="dialog-description">{{data.detalleNotificacion | slice:0:100}}{{data.detalleNotificacion.length > 100 ? '...' : ''}}</p>
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
export class NotificacionEliminarComponent {
  eliminando = false

  constructor(
    public dialogRef: MatDialogRef<NotificacionEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Notificacion,
    private notificacionService: NotificacionService,
    private errorHandler: ErrorHandlerService,
  ) {}

  onNoClick(): void {
    this.dialogRef.close()
  }

  eliminar(): void {
    this.eliminando = true
    this.notificacionService.eliminar(this.data.idNotificacion).subscribe({
      next: () => {
        this.errorHandler.showSuccess("Notificación eliminada correctamente")
        this.dialogRef.close(true)
      },
      error: (error) => {
        this.errorHandler.handleError(error)
        this.eliminando = false
      },
    })
  }
}
