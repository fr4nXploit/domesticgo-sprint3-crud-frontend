import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatSelectModule } from "@angular/material/select"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatChipsModule } from "@angular/material/chips"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatDialog } from "@angular/material/dialog"

import { ObservacionService } from "../../services/observacion.service"
import { ErrorHandlerService } from "../../services/error-handler.service"
import { Observacion } from "../../models/observacion"
import { ObservacionEliminarComponent } from "../observacion-eliminar/observacion-eliminar.component"

@Component({
  selector: "app-observacion-listar",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  templateUrl: "./observacion-listar.component.html",
  styleUrls: ["./observacion-listar.component.css"],
})
export class ObservacionListarComponent implements OnInit {
  observaciones: Observacion[] = []
  observacionesFiltradas: Observacion[] = []
  loading = false
  searchTerm = ""
  filtroUsuario = ""
  filtroServicio = ""

  // Paginación
  currentPage = 1
  itemsPerPage = 12
  totalItems = 0

  // Exponer Math para el template
  Math = Math

  constructor(
    private observacionService: ObservacionService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarObservaciones()
  }

  cargarObservaciones(): void {
    this.loading = true
    this.observacionService.listar().subscribe({
      next: (data) => {
        this.observaciones = data
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
    let resultado = [...this.observaciones]

    // Filtro por término de búsqueda (busca en detalle de observación)
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase()
      resultado = resultado.filter(
        (obs) =>
          obs.detalleObservacion.toLowerCase().includes(term) ||
          obs.usuario.nombres.toLowerCase().includes(term) ||
          obs.usuario.apellidoPaterno.toLowerCase().includes(term) ||
          obs.servicio.tipoServicio.toLowerCase().includes(term),
      )
    }

    // Filtro por usuario
    if (this.filtroUsuario) {
      resultado = resultado.filter((obs) =>
        `${obs.usuario.nombres} ${obs.usuario.apellidoPaterno}`
          .toLowerCase()
          .includes(this.filtroUsuario.toLowerCase()),
      )
    }

    // Filtro por tipo de servicio
    if (this.filtroServicio) {
      resultado = resultado.filter((obs) => obs.servicio.tipoServicio === this.filtroServicio)
    }

    this.observacionesFiltradas = resultado
    this.totalItems = resultado.length
    this.currentPage = 1
  }

  onSearchChange(): void {
    this.aplicarFiltros()
  }

  onFiltroChange(): void {
    this.aplicarFiltros()
  }

  limpiarFiltros(): void {
    this.searchTerm = ""
    this.filtroUsuario = ""
    this.filtroServicio = ""
    this.aplicarFiltros()
  }

  get observacionesPaginadas(): Observacion[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    const endIndex = startIndex + this.itemsPerPage
    return this.observacionesFiltradas.slice(startIndex, endIndex)
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage)
  }

  cambiarPagina(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page
    }
  }

  getPaginationArray(): number[] {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2))
    const end = Math.min(this.totalPages, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  crear(): void {
    this.router.navigate(["/observaciones/crear"])
  }

  ver(id: number): void {
    this.router.navigate(["/observaciones/ver", id])
  }

  editar(id: number): void {
    this.router.navigate(["/observaciones/editar", id])
  }

  eliminar(observacion: Observacion): void {
        const dialogRef = this.dialog.open(ObservacionEliminarComponent, {
          width: "400px",
          data: observacion,
        })
    
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.cargarObservaciones()
          }
        })
      }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  getNombreCompleto(observacion: Observacion): string {
    return `${observacion.usuario.nombres} ${observacion.usuario.apellidoPaterno} ${observacion.usuario.apellidoMaterno}`.trim()
  }

  getIniciales(observacion: Observacion): string {
    const nombres = observacion.usuario.nombres.split(" ")
    const apellido = observacion.usuario.apellidoPaterno
    return `${nombres[0]?.charAt(0) || ""}${apellido?.charAt(0) || ""}`.toUpperCase()
  }

  get tiposServicioUnicos(): string[] {
    return [...new Set(this.observaciones.map((obs) => obs.servicio.tipoServicio))].sort()
  }

  get usuariosUnicos(): string[] {
    return [...new Set(this.observaciones.map((obs) => `${obs.usuario.nombres} ${obs.usuario.apellidoPaterno}`))].sort()
  }

  getEstadoServicio(observacion: Observacion): string {
    return observacion.servicio.estadoServicio || "Sin estado"
  }

  getEstadoServicioClass(estado: string): string {
    const classes: { [key: string]: string } = {
      PENDIENTE: "estado-pendiente",
      EN_PROCESO: "estado-proceso",
      COMPLETADO: "estado-completado",
      CANCELADO: "estado-cancelado",
    }
    return classes[estado.toUpperCase()] || "estado-default"
  }

  getTipoServicioIcon(tipo: string): string {
    const icons: { [key: string]: string } = {
      LIMPIEZA: "cleaning_services",
      JARDINERIA: "grass",
      PLOMERIA: "plumbing",
      ELECTRICIDAD: "electrical_services",
      PINTURA: "format_paint",
      CARPINTERIA: "handyman",
      COCINA: "restaurant",
      CUIDADO: "favorite",
    }
    return icons[tipo.toUpperCase()] || "build"
  }

  exportarDatos(): void {
    // Funcionalidad para exportar datos (opcional)
    this.errorHandler.showInfo("Funcionalidad de exportación en desarrollo")
  }

  refrescar(): void {
    this.cargarObservaciones()
  }
}
