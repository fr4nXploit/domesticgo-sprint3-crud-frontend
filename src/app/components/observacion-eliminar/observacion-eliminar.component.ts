import { Component, Inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { ObservacionService } from "../../services/observacion.service"
import { ErrorHandlerService } from "../../services/error-handler.service"
import { Observacion } from "../../models/observacion"

@Component({
  selector: "app-observacion-eliminar",
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
          ¿Está seguro que desea eliminar la observación de 
          <strong>{{data.usuario.nombres}} {{data.usuario.apellidoPaterno}}</strong>?
        </p>
        <p class="dialog-detail">
          "{{data.detalleObservacion.substring(0, 100)}}{{data.detalleObservacion.length > 100 ? '...' : ''}}"
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
  styles: [
    `
    .dialog-container {
      padding: 0;
      max-width: 450px;
    }
    .dialog-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 24px 16px;
      border-bottom: 1px solid #f3f4f6;
    }
    .warning-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #fef2f2;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #dc2626;
    }
    .warning-icon mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    .dialog-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }
    .dialog-content {
      padding: 16px 24px;
    }
    .dialog-message {
      color: #374151;
      margin: 0 0 8px 0;
      line-height: 1.5;
    }
    .dialog-detail {
      color: #6b7280;
      font-style: italic;
      margin: 8px 0;
      padding: 8px;
      background: #f9fafb;
      border-radius: 4px;
      font-size: 0.9rem;
    }
    .dialog-warning {
      color: #6b7280;
      font-size: 0.85rem;
      margin: 8px 0 0 0;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 16px 24px 20px;
      border-top: 1px solid #f3f4f6;
    }
    .cancel-button {
      color: #6b7280;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-weight: 500;
    }
    .cancel-button:hover {
      background-color: #f3f4f6;
    }
    .delete-button {
      background: #dc2626;
      color: white;
      border-radius: 6px;
      font-weight: 500;
    }
    .delete-button:hover {
      background: #b91c1c;
    }
    .delete-button:disabled {
      background: #d1d5db;
      color: #9ca3af;
    }
  `,
  ],
})
export class ObservacionEliminarComponent {
  eliminando = false

  constructor(
    public dialogRef: MatDialogRef<ObservacionEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Observacion,
    private observacionService: ObservacionService,
    private errorHandler: ErrorHandlerService
  ) {}

  onNoClick(): void {
    this.dialogRef.close()
  }

  eliminar(): void {
    this.eliminando = true
    this.observacionService.eliminar(this.data.idObservacion).subscribe({
      next: () => {
        this.errorHandler.showSuccess("Observación eliminada correctamente")
        this.dialogRef.close(true)
      },
      error: (error: any) => {
        this.errorHandler.handleError(error)
        this.eliminando = false
      },
    })
  }
}
