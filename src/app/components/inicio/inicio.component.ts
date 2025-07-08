import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatGridListModule } from "@angular/material/grid-list"
import { RouterModule } from "@angular/router"
import { AuthService } from "../../services/auth.service"
import { UsuarioService } from "../../services/usuario.service"
import { EmpleoService } from "../../services/empleo.service"
import { ContratoService } from "../../services/contrato.service"
import { ServicioService } from "../../services/servicio.service"

@Component({
  selector: "app-inicio",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    RouterModule,
  ],
  templateUrl: "./inicio.component.html",
  styleUrls: ["./inicio.component.css"],
})
export class InicioComponent implements OnInit {
  currentUser: any
  isAdmin = false
  isCliente = false

  totalUsuarios = 0
  totalEmpleos = 0
  totalServicios = 0
  totalContratos = 0

  quickActions = [
    { title: "Ver Usuarios", icon: "people", route: "/usuarios", color: "#6366f1", adminOnly: false },
    { title: "Ver Empleos", icon: "work", route: "/empleos", color: "#059669", adminOnly: false },
    { title: "Ver Servicios", icon: "room_service", route: "/servicios", color: "#dc2626", adminOnly: false },
    { title: "Ver Contratos", icon: "description", route: "/contratos", color: "#7c3aed", adminOnly: false },
    { title: "Crear Usuario", icon: "person_add", route: "/usuarios/crear", color: "#ea580c", adminOnly: true },
    { title: "Crear Empleo", icon: "add_business", route: "/empleos/crear", color: "#0891b2", adminOnly: true },
  ]

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private empleoService: EmpleoService,
    private contratoService: ContratoService,
    private servicioService: ServicioService,
  ) {}

  ngOnInit() {
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user
      this.isAdmin = this.authService.isAdmin()
      this.isCliente = this.authService.isCliente()
    })

    this.cargarEstadisticas()
  }

  cargarEstadisticas() {
    this.usuarioService.listar().subscribe({
      next: (usuarios) => (this.totalUsuarios = usuarios.length),
      error: () => (this.totalUsuarios = 0),
    })

    this.empleoService.listar().subscribe({
      next: (empleos) => (this.totalEmpleos = empleos.length),
      error: () => (this.totalEmpleos = 0),
    })

    this.contratoService.listar().subscribe({
      next: (contratos) => (this.totalContratos = contratos.length),
      error: () => (this.totalContratos = 0),
    })

    this.servicioService.listar().subscribe({
      next: (servicios) => (this.totalServicios = servicios.length),
      error: () => (this.totalServicios = 0),
    })
  }

  getGreeting(): string {
    const hour = new Date().getHours()
    if (hour < 12) return "Buenos días"
    if (hour < 18) return "Buenas tardes"
    return "Buenas noches"
  }
}
