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
import { Empleo } from "../../models/empleo"
import { EmpleoService } from "../../services/empleo.service"
import { AuthService } from "../../services/auth.service"
import { EmpleoEliminarComponent } from "../empleo-eliminar/empleo-eliminar.component"

@Component({
  selector: "app-empleo-listar",
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
  templateUrl: "./empleo-listar.component.html",
  styleUrls: ["./empleo-listar.component.css"],
})
export class EmpleoListarComponent implements OnInit {
  empleos: Empleo[] = []
  empleosFiltrados: Empleo[] = []
  loading = true
  isAdmin = false

  constructor(
    private empleoService: EmpleoService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin()
    this.cargarEmpleos()
  }

  cargarEmpleos(): void {
    this.loading = true
    this.empleoService.listar().subscribe({
      next: (data) => {
        this.empleos = data
        this.empleosFiltrados = data
        this.loading = false
      },
      error: (error) => {
        this.snackBar.open("Error al cargar empleos", "Cerrar", {
          duration: 3000,
        })
        this.loading = false
      },
    })
  }

  eliminar(empleo: Empleo): void {
    const dialogRef = this.dialog.open(EmpleoEliminarComponent, {
      width: "400px",
      data: empleo,
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarEmpleos()
      }
    })
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase()
    this.empleosFiltrados = this.empleos.filter((empleo) => empleo.nombreEmpleo.toLowerCase().includes(filterValue))
  }
}
