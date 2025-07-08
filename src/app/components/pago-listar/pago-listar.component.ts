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

import { PagoService } from "../../services/pago.service"
import { ErrorHandlerService } from "../../services/error-handler.service"
import { Pago } from "../../models/pago"
import { PagoEliminarComponent } from "../pago-eliminar/pago-eliminar.component"

@Component({
  selector: "app-pago-listar",
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
  templateUrl: "./pago-listar.component.html",
  styleUrls: ["./pago-listar.component.css"],
})
export class PagoListarComponent implements OnInit {
  pagos: Pago[] = []
  pagosFiltrados: Pago[] = []
  loading = false
  searchTerm = ""

  // Paginación
  currentPage = 1
  itemsPerPage = 12
  totalItems = 0

  // Exponer Math para el template
  Math = Math

  constructor(
    private pagoService: PagoService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarPagos()
  }

  cargarPagos(): void {
    this.loading = true
    this.pagoService.listar().subscribe({
      next: (data) => {
        this.pagos = data
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
    let resultado = [...this.pagos]

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase()
      resultado = resultado.filter(
        (pago) =>
          pago.montoPago.toString().includes(term) ||
          pago.tipoPago.toLowerCase().includes(term) ||
          pago.bancoPago.toLowerCase().includes(term) ||
          pago.tipoComprobante.toLowerCase().includes(term),
      )
    }

    this.pagosFiltrados = resultado
    this.totalItems = resultado.length
    this.currentPage = 1
  }

  onSearchChange(): void {
    this.aplicarFiltros()
  }

  get pagosPaginados(): Pago[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    const endIndex = startIndex + this.itemsPerPage
    return this.pagosFiltrados.slice(startIndex, endIndex)
  }

  crear(): void {
    this.router.navigate(["/pagos/crear"])
  }

  ver(id: number): void {
    this.router.navigate(["/pagos/ver", id])
  }

  editar(id: number): void {
    this.router.navigate(["/pagos/editar", id])
  }

  eliminar(pago: Pago): void {
        const dialogRef = this.dialog.open(PagoEliminarComponent, {
          width: "400px",
          data: pago,
        })
    
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.cargarPagos()
          }
        })
      }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
}
