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

import { ReservaService } from "../../services/reserva.service"
import { ErrorHandlerService } from "../../services/error-handler.service"
import { Reserva } from "../../models/reserva"
import { ReservaEliminarComponent } from "../reserva-eliminar/reserva-eliminar.component"

@Component({
  selector: "app-reserva-listar",
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
  templateUrl: "./reserva-listar.component.html",
  styleUrls: ["./reserva-listar.component.css"],
})
export class ReservaListarComponent implements OnInit {
  reservas: Reserva[] = []
  reservasFiltradas: Reserva[] = []
  loading = false
  searchTerm = ""

  // Paginación
  currentPage = 1
  itemsPerPage = 12
  totalItems = 0

  // Exponer Math para el template
  Math = Math

  constructor(
    private reservaService: ReservaService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarReservas()
  }

  cargarReservas(): void {
    this.loading = true
    this.reservaService.listar().subscribe({
      next: (data) => {
        this.reservas = data
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
    let resultado = [...this.reservas]

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase()
      resultado = resultado.filter((reserva) => reserva.detalleReserva.toLowerCase().includes(term))
    }

    this.reservasFiltradas = resultado
    this.totalItems = resultado.length
    this.currentPage = 1
  }

  onSearchChange(): void {
    this.aplicarFiltros()
  }

  get reservasPaginadas(): Reserva[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    const endIndex = startIndex + this.itemsPerPage
    return this.reservasFiltradas.slice(startIndex, endIndex)
  }

  crear(): void {
    this.router.navigate(["/reservas/crear"])
  }

  ver(id: number): void {
    this.router.navigate(["/reservas/ver", id])
  }

  editar(id: number): void {
    this.router.navigate(["/reservas/editar", id])
  }

  eliminar(reserva: Reserva): void {
        const dialogRef = this.dialog.open(ReservaEliminarComponent, {
          width: "400px",
          data: reserva,
        })
    
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.cargarReservas()
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

  getEstadoClass(estado: string): string {
    const classes: { [key: string]: string } = {
      PENDIENTE: "pendiente",
      CONFIRMADA: "confirmada",
      CANCELADA: "cancelada",
    }
    return classes[estado.toUpperCase()] || ""
  }
}
