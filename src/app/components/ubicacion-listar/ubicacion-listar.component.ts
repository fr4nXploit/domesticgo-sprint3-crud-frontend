import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatDialog } from "@angular/material/dialog"

import { UbicacionService } from "../../services/ubicacion.service"
import { ErrorHandlerService } from "../../services/error-handler.service"
import { Ubicacion } from "../../models/ubicacion"
import { UbicacionEliminarComponent } from "../ubicacion-eliminar/ubicacion-eliminar.component"

@Component({
  selector: "app-ubicacion-listar",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: "./ubicacion-listar.component.html",
  styleUrls: ["./ubicacion-listar.component.css"],
})
export class UbicacionListarComponent implements OnInit {
  ubicaciones: Ubicacion[] = []
  ubicacionesFiltradas: Ubicacion[] = []
  loading = false
  searchTerm = ""

  // Paginación
  currentPage = 1
  itemsPerPage = 12
  totalItems = 0

  // Exponer Math para el template
  Math = Math

  constructor(
    private ubicacionService: UbicacionService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarUbicaciones()
  }

  cargarUbicaciones(): void {
    this.loading = true
    this.ubicacionService.listar().subscribe({
      next: (data) => {
        this.ubicaciones = data
        this.aplicarFiltros()
        this.loading = false
      },
      error: (error) => {
        this.errorHandler.handleError(error)
        this.loading = false
      },
    })
  }

  aplicarFiltros(): void {
    let resultado = [...this.ubicaciones]

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase()
      resultado = resultado.filter((ubicacion) => ubicacion.direccion.toLowerCase().includes(term))
    }

    this.ubicacionesFiltradas = resultado
    this.totalItems = resultado.length
    this.currentPage = 1
  }

  onSearchChange(): void {
    this.aplicarFiltros()
  }

  get ubicacionesPaginadas(): Ubicacion[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    const endIndex = startIndex + this.itemsPerPage
    return this.ubicacionesFiltradas.slice(startIndex, endIndex)
  }

  crear(): void {
    this.router.navigate(["/ubicaciones/crear"])
  }

  ver(id: number): void {
    this.router.navigate(["/ubicaciones/ver", id])
  }

  editar(id: number): void {
    this.router.navigate(["/ubicaciones/editar", id])
  }

  eliminar(ubicacion: Ubicacion): void {
        const dialogRef = this.dialog.open(UbicacionEliminarComponent, {
          width: "400px",
          data: ubicacion,
        })
    
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.cargarUbicaciones()
          }
        })
      }

  getMapThumbnailUrl(ubicacion: Ubicacion): string {
    // Usar OpenStreetMap para generar miniatura del mapa
    const lat = Number.parseFloat(ubicacion.latitud)
    const lng = Number.parseFloat(ubicacion.longitud)
    const zoom = 15
    const width = 300
    const height = 200

    // Usar servicio de mapas estático de MapBox (alternativa gratuita)
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-l+000(${lng},${lat})/${lng},${lat},${zoom}/${width}x${height}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`
  }

  abrirEnMapa(ubicacion: Ubicacion): void {
    if (ubicacion.enlaceUbicacion) {
      window.open(ubicacion.enlaceUbicacion, "_blank")
    } else {
      // Abrir en Google Maps como fallback
      const lat = ubicacion.latitud
      const lng = ubicacion.longitud
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank")
    }
  }

  copiarCoordenadas(ubicacion: Ubicacion): void {
    const coordenadas = `${ubicacion.latitud}, ${ubicacion.longitud}`
    navigator.clipboard
      .writeText(coordenadas)
      .then(() => {
        this.errorHandler.showSuccess("Coordenadas copiadas al portapapeles")
      })
      .catch(() => {
        this.errorHandler.showWarning("No se pudieron copiar las coordenadas")
      })
  }

  getDireccionCorta(direccion: string): string {
    return direccion.length > 50 ? direccion.substring(0, 50) + "..." : direccion
  }

  onImageError(event: any): void {
    event.target.style.display = "none"
  }
}
