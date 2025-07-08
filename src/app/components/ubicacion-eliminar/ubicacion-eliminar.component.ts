import { Component, Inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { UbicacionService } from "../../services/ubicacion.service"
import { ErrorHandlerService } from "../../services/error-handler.service"
import { Ubicacion } from "../../models/ubicacion"

@Component({
  selector: "app-ubicacion-eliminar",
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
          ¿Está seguro que desea eliminar la siguiente ubicación?
        </p>
        <p class="dialog-detail">
          Dirección: "{{data.direccion}}"
        </p>
        <p class="dialog-warning" *ngIf="data.enlaceUbicacion">
          Enlace: <a [href]="data.enlaceUbicacion" target="_blank">{{data.enlaceUbicacion}}</a>
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
export class UbicacionEliminarComponent {
  eliminando = false

  constructor(
    public dialogRef: MatDialogRef<UbicacionEliminarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Ubicacion,
    private ubicacionService: UbicacionService,
    private errorHandler: ErrorHandlerService
  ) {}

  onNoClick(): void {
    this.dialogRef.close()
  }

  eliminar(): void {
    this.eliminando = true
    this.ubicacionService.eliminar(this.data.idUbicacion).subscribe({
      next: () => {
        this.errorHandler.showSuccess("Ubicación eliminada correctamente")
        this.dialogRef.close(true)
      },
      error: (error: any) => {
        this.errorHandler.handleError(error)
        this.eliminando = false
      },
    })
  }
}
