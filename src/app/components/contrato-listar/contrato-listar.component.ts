import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatChipsModule } from "@angular/material/chips"
import { MatDialog, MatDialogModule } from "@angular/material/dialog"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { Contrato } from "../../models/contrato"
import { ContratoService } from "../../services/contrato.service"
import { AuthService } from "../../services/auth.service"
import { ContratoEliminarComponent } from "../contrato-eliminar/contrato-eliminar.component"

@Component({
  selector: "app-contrato-listar",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: "./contrato-listar.component.html",
  styleUrls: ["./contrato-listar.component.css"],
})
export class ContratoListarComponent implements OnInit {
  contratos: Contrato[] = []
  contratosFiltrados: Contrato[] = []
  loading = true
  isAdmin = false

  constructor(
    private contratoService: ContratoService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin()
    this.cargarContratos()
  }

  cargarContratos(): void {
    this.loading = true
    this.contratoService.listar().subscribe({
      next: (data) => {
        this.contratos = data
        this.contratosFiltrados = data
        this.loading = false
      },
      error: (error) => {
        this.snackBar.open("Error al cargar contratos", "Cerrar", {
          duration: 3000,
        })
        this.loading = false
      },
    })
  }

  eliminar(contrato: Contrato): void {
    const dialogRef = this.dialog.open(ContratoEliminarComponent, {
      width: "400px",
      data: contrato,
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarContratos()
      }
    })
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase()
    this.contratosFiltrados = this.contratos.filter(
      (contrato) =>
        contrato.descripcionContrato.toLowerCase().includes(filterValue) ||
        contrato.contratante?.nombres.toLowerCase().includes(filterValue) ||
        contrato.contratado?.nombres.toLowerCase().includes(filterValue) ||
        contrato.ubicacion?.direccion.toLowerCase().includes(filterValue),
    )
  }
}
