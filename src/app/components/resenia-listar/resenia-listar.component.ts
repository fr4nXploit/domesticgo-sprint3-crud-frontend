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

import { ReseniaService } from "../../services/resenia.service"
import { ErrorHandlerService } from "../../services/error-handler.service"
import { Resenia } from "../../models/resenia"
import { ReseniaEliminarComponent } from "../resenia-eliminar/resenia-eliminar.component"

@Component({
  selector: "app-resenia-listar",
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
  templateUrl: "./resenia-listar.component.html",
  styleUrls: ["./resenia-listar.component.css"],
})
export class ReseniaListarComponent implements OnInit {
  resenias: Resenia[] = []
  reseniasFiltradas: Resenia[] = []
  loading = false
  searchTerm = ""

  // Paginación
  currentPage = 1
  itemsPerPage = 12
  totalItems = 0

  // Exponer Math para el template
  Math = Math

  constructor(
    private reseniaService: ReseniaService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarResenias()
  }

  cargarResenias(): void {
    this.loading = true
    this.reseniaService.listar().subscribe({
      next: (data) => {
        this.resenias = data
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
    let resultado = [...this.resenias]

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase()
      resultado = resultado.filter(
        (resenia) =>
          resenia.detalleResenia.toLowerCase().includes(term) ||
          resenia.usuario.nombres.toLowerCase().includes(term) ||
          resenia.usuario.apellidoPaterno.toLowerCase().includes(term) ||
          resenia.servicio.tipoServicio.toLowerCase().includes(term),
      )
    }

    this.reseniasFiltradas = resultado
    this.totalItems = resultado.length
    this.currentPage = 1
  }

  onSearchChange(): void {
    this.aplicarFiltros()
  }

  get reseniasPaginadas(): Resenia[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    const endIndex = startIndex + this.itemsPerPage
    return this.reseniasFiltradas.slice(startIndex, endIndex)
  }

  crear(): void {
    this.router.navigate(["/resenias/crear"])
  }

  ver(id: number): void {
    this.router.navigate(["/resenias/ver", id])
  }

  editar(id: number): void {
    this.router.navigate(["/resenias/editar", id])
  }

  eliminar(resenia: Resenia): void {
          const dialogRef = this.dialog.open(ReseniaEliminarComponent, {
            width: "400px",
            data: resenia,
          })
      
          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              this.cargarResenias()
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

  getNombreCompleto(resenia: Resenia): string {
    return `${resenia.usuario.nombres} ${resenia.usuario.apellidoPaterno} ${resenia.usuario.apellidoMaterno}`.trim()
  }
}
