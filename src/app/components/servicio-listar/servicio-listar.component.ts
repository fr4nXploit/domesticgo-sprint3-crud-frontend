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
import { Servicio } from "../../models/servicio"
import { ServicioService } from "../../services/servicio.service"
import { AuthService } from "../../services/auth.service"
import { ServicioEliminarComponent } from "../servicio-eliminar/servicio-eliminar.component"

@Component({
  selector: "app-servicio-listar",
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
  templateUrl: "./servicio-listar.component.html",
  styleUrls: ["./servicio-listar.component.css"],
})
export class ServicioListarComponent implements OnInit {
  servicios: Servicio[] = []
  serviciosFiltrados: Servicio[] = []
  loading = true
  isAdmin = false

  constructor(
    private servicioService: ServicioService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin()
    this.cargarServicios()
  }

  cargarServicios(): void {
    this.loading = true
    this.servicioService.listar().subscribe({
      next: (data) => {
        this.servicios = data
        this.serviciosFiltrados = data
        this.loading = false
      },
      error: (error) => {
        this.snackBar.open("Error al cargar servicios", "Cerrar", {
          duration: 3000,
        })
        this.loading = false
      },
    })
  }

  eliminar(servicio: Servicio): void {
    const dialogRef = this.dialog.open(ServicioEliminarComponent, {
      width: "400px",
      data: servicio,
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarServicios()
      }
    })
  }

  getEstadoClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case "activo":
        return "estado-activo"
      case "pendiente":
        return "estado-pendiente"
      case "completado":
        return "estado-completado"
      case "cancelado":
        return "estado-cancelado"
      default:
        return ""
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase()
    this.serviciosFiltrados = this.servicios.filter(
      (servicio) =>
        servicio.estadoServicio.toLowerCase().includes(filterValue) ||
        servicio.tipoServicio.toLowerCase().includes(filterValue),
    )
  }
}
