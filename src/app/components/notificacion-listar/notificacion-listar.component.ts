import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatChipsModule } from "@angular/material/chips"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatSelectModule } from "@angular/material/select"
import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatNativeDateModule } from "@angular/material/core"
import { MatDialog } from "@angular/material/dialog"

import { Notificacion } from "../../models/notificacion"
import { NotificacionService } from "../../services/notificacion.service"
import { ErrorHandlerService } from "../../services/error-handler.service"
import { AuthService } from "../../services/auth.service"
import { Router } from "@angular/router"
import { NotificacionEliminarComponent } from "../notificacion-eliminar/notificacion-eliminar.component"

@Component({
  selector: "app-notificacion-listar",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: "./notificacion-listar.component.html",
  styleUrls: ["./notificacion-listar.component.css"],
})
export class NotificacionListarComponent implements OnInit {
  notificaciones: Notificacion[] = []
  notificacionesFiltradas: Notificacion[] = []
  loading = false
  searchTerm = ""
  filtroUsuario = ""
  filtroFecha: Date | null = null

  // Paginación
  currentPage = 1
  itemsPerPage = 10
  totalItems = 0

  // Exponer Math para el template
  Math = Math

  constructor(
    private notificacionService: NotificacionService,
    private errorHandler: ErrorHandlerService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog // <-- Agregado aquí
  ) {}

  ngOnInit(): void {
    this.cargarNotificaciones()
  }

  cargarNotificaciones(): void {
    this.loading = true
    this.notificacionService.listar().subscribe({
      next: (data) => {
        this.notificaciones = data
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
    let resultado = [...this.notificaciones]

    // Filtro por término de búsqueda
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase()
      resultado = resultado.filter(
        (notif) =>
          notif.detalleNotificacion.toLowerCase().includes(term) ||
          notif.usuario.nombres.toLowerCase().includes(term) ||
          notif.usuario.apellidoPaterno.toLowerCase().includes(term),
      )
    }

    // Filtro por usuario
    if (this.filtroUsuario) {
      resultado = resultado.filter((notif) =>
        `${notif.usuario.nombres} ${notif.usuario.apellidoPaterno}`
          .toLowerCase()
          .includes(this.filtroUsuario.toLowerCase()),
      )
    }

    // Filtro por fecha
    if (this.filtroFecha) {
      const fechaFiltro = new Date(this.filtroFecha).toDateString()
      resultado = resultado.filter((notif) => new Date(notif.fechaNotificacion).toDateString() === fechaFiltro)
    }

    // Ordenar por fecha más reciente
    resultado.sort((a, b) => new Date(b.fechaNotificacion).getTime() - new Date(a.fechaNotificacion).getTime())

    this.notificacionesFiltradas = resultado
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
    this.filtroFecha = null
    this.aplicarFiltros()
  }

  get notificacionesPaginadas(): Notificacion[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    const endIndex = startIndex + this.itemsPerPage
    return this.notificacionesFiltradas.slice(startIndex, endIndex)
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
    this.router.navigate(["/notificaciones/crear"])
  }

  ver(id: number): void {
    this.router.navigate(["/notificaciones/ver", id])
  }

  editar(id: number): void {
    this.router.navigate(["/notificaciones/editar", id])
  }

  eliminar(notificacion: Notificacion): void {
      const dialogRef = this.dialog.open(NotificacionEliminarComponent, {
        width: "400px",
        data: notificacion,
      })
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.cargarNotificaciones()
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

  formatearFechaRelativa(fecha: Date): string {
    const ahora = new Date()
    const fechaNotif = new Date(fecha)
    const diffMs = ahora.getTime() - fechaNotif.getTime()
    const diffMinutos = Math.floor(diffMs / (1000 * 60))
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMinutos < 1) return "Hace un momento"
    if (diffMinutos < 60) return `Hace ${diffMinutos} minuto${diffMinutos > 1 ? "s" : ""}`
    if (diffHoras < 24) return `Hace ${diffHoras} hora${diffHoras > 1 ? "s" : ""}`
    if (diffDias < 7) return `Hace ${diffDias} día${diffDias > 1 ? "s" : ""}`
    return this.formatearFecha(fecha)
  }

  getNombreCompleto(notificacion: Notificacion): string {
    return `${notificacion.usuario.nombres} ${notificacion.usuario.apellidoPaterno} ${notificacion.usuario.apellidoMaterno}`.trim()
  }

  getIniciales(notificacion: Notificacion): string {
    const nombres = notificacion.usuario.nombres.split(" ")
    const apellido = notificacion.usuario.apellidoPaterno
    return `${nombres[0]?.charAt(0) || ""}${apellido?.charAt(0) || ""}`.toUpperCase()
  }

  getNotificacionIcon(detalle: string): string {
    const detalleMin = detalle.toLowerCase()
    if (detalleMin.includes("pago")) return "payment"
    if (detalleMin.includes("servicio")) return "build"
    if (detalleMin.includes("contrato")) return "description"
    if (detalleMin.includes("reserva")) return "event"
    if (detalleMin.includes("usuario")) return "person"
    return "notifications"
  }

  getNotificacionColor(detalle: string): string {
    const detalleMin = detalle.toLowerCase()
    if (detalleMin.includes("error") || detalleMin.includes("problema")) return "warn"
    if (detalleMin.includes("éxito") || detalleMin.includes("completado")) return "primary"
    if (detalleMin.includes("pendiente") || detalleMin.includes("espera")) return "accent"
    return "primary"
  }

  get usuariosUnicos(): string[] {
    return [
      ...new Set(this.notificaciones.map((notif) => `${notif.usuario.nombres} ${notif.usuario.apellidoPaterno}`)),
    ].sort()
  }

  get notificacionesHoy(): number {
    const hoy = new Date().toDateString()
    return this.notificaciones.filter((notif) => new Date(notif.fechaNotificacion).toDateString() === hoy).length
  }

  get notificacionesEstaSemana(): number {
    const ahora = new Date()
    const inicioSemana = new Date(ahora.setDate(ahora.getDate() - ahora.getDay()))
    return this.notificaciones.filter((notif) => new Date(notif.fechaNotificacion) >= inicioSemana).length
  }

  exportarDatos(): void {
    this.errorHandler.showInfo("Funcionalidad de exportación en desarrollo")
  }

  refrescar(): void {
    this.cargarNotificaciones()
  }

  get isAdmin(): boolean {
    // Implementar según tu lógica de autenticación
    return this.authService.getToken() !== null // Simplificado
  }
}
