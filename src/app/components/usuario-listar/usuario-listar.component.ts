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
import { Usuario } from "../../models/usuario"
import { UsuarioService } from "../../services/usuario.service"
import { AuthService } from "../../services/auth.service"
import { UsuarioEliminarComponent } from "../usuario-eliminar/usuario-eliminar.component"

@Component({
  selector: "app-usuario-listar",
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
  templateUrl: "./usuario-listar.component.html",
  styleUrls: ["./usuario-listar.component.css"],
})
export class UsuarioListarComponent implements OnInit {
  usuarios: Usuario[] = []
  usuariosFiltrados: Usuario[] = []
  loading = true
  isAdmin = false

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin()
    this.cargarUsuarios()
  }

  cargarUsuarios(): void {
    this.loading = true
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarios = data
        this.usuariosFiltrados = data
        this.loading = false
      },
      error: (error) => {
        this.snackBar.open("Error al cargar usuarios", "Cerrar", {
          duration: 3000,
        })
        this.loading = false
      },
    })
  }

  eliminar(usuario: Usuario): void {
    const dialogRef = this.dialog.open(UsuarioEliminarComponent, {
      width: "400px",
      data: usuario,
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarUsuarios()
      }
    })
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase()
    this.usuariosFiltrados = this.usuarios.filter(
      (usuario) =>
        usuario.nombres.toLowerCase().includes(filterValue) ||
        usuario.apellidoPaterno.toLowerCase().includes(filterValue) ||
        usuario.email.toLowerCase().includes(filterValue) ||
        usuario.empleo?.nombreEmpleo.toLowerCase().includes(filterValue),
    )
  }
}
