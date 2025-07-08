import { Routes } from "@angular/router"
import { LandingComponent } from "./components/landing/landing.component"
import { LoginComponent } from "./components/login/login.component"
import { LayoutComponent } from "./components/layout/layout.component"
import { InicioComponent } from "./components/inicio/inicio.component"
import { UsuarioListarComponent } from "./components/usuario-listar/usuario-listar.component"
import { UsuarioCrearEditarComponent } from "./components/usuario-crear-editar/usuario-crear-editar.component"
import { EmpleoListarComponent } from "./components/empleo-listar/empleo-listar.component"
import { EmpleoCrearEditarComponent } from "./components/empleo-crear-editar/empleo-crear-editar.component"
import { ServicioListarComponent } from "./components/servicio-listar/servicio-listar.component"
import { ServicioCrearEditarComponent } from "./components/servicio-crear-editar/servicio-crear-editar.component"
import { ContratoListarComponent } from "./components/contrato-listar/contrato-listar.component"
import { ContratoCrearEditarComponent } from "./components/contrato-crear-editar/contrato-crear-editar.component"
import { NotificacionListarComponent } from "./components/notificacion-listar/notificacion-listar.component"
import { NotificacionCrearEditarComponent } from "./components/notificacion-crear-editar/notificacion-crear-editar.component"
import { ReportesComponent } from "./components/reportes/reportes.component"
import { AuthGuard } from "./guards/auth.guard"
import { ObservacionListarComponent } from "./components/observacion-listar/observacion-listar.component"
import { ObservacionCrearEditarComponent } from "./components/observacion-crear-editar/observacion-crear-editar.component"
import { ReseniaListarComponent } from "./components/resenia-listar/resenia-listar.component"
import { ReseniaCrearEditarComponent } from "./components/resenia-crear-editar/resenia-crear-editar.component"
import { ReservaListarComponent } from "./components/reserva-listar/reserva-listar.component"
import { PagoListarComponent } from "./components/pago-listar/pago-listar.component"
import { PagoCrearEditarComponent } from "./components/pago-crear-editar/pago-crear-editar.component"
import { ReservaCrearEditarComponent } from "./components/reserva-crear-editar/reserva-crear-editar.component"
import { UbicacionListarComponent } from "./components/ubicacion-listar/ubicacion-listar.component"
import { UbicacionCrearEditarComponent } from "./components/ubicacion-crear-editar/ubicacion-crear-editar.component"
import { ChatComponent } from "./components/chat-listar/chat-listar.component"

export const routes: Routes = [
  { path: "", component: LandingComponent },
  { path: "login", component: LoginComponent },
  {
    path: "",
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "inicio", component: InicioComponent },
      { path: "usuarios", component: UsuarioListarComponent },
      { path: "usuarios/crear", component: UsuarioCrearEditarComponent },
      { path: "usuarios/editar/:id", component: UsuarioCrearEditarComponent },
      { path: "empleos", component: EmpleoListarComponent },
      { path: "empleos/crear", component: EmpleoCrearEditarComponent },
      { path: "empleos/editar/:id", component: EmpleoCrearEditarComponent },
      { path: "servicios", component: ServicioListarComponent },
      { path: "servicios/crear", component: ServicioCrearEditarComponent },
      { path: "servicios/editar/:id", component: ServicioCrearEditarComponent },
      { path: "contratos", component: ContratoListarComponent },
      { path: "contratos/crear", component: ContratoCrearEditarComponent },
      { path: "contratos/editar/:id", component: ContratoCrearEditarComponent },
      { path: "chats", component: ChatComponent},
      { path: "notificaciones", component: NotificacionListarComponent },
      { path: "notificaciones/crear", component: NotificacionCrearEditarComponent },
      { path: "notificaciones/editar/:id", component: NotificacionCrearEditarComponent },
      { path: "observaciones", component: ObservacionListarComponent },
      { path: "observaciones/crear", component: ObservacionCrearEditarComponent },
      { path: "observaciones/editar/:id", component: ObservacionCrearEditarComponent },
      { path: "resenias", component: ReseniaListarComponent },
      { path: "resenias/crear", component: ReseniaCrearEditarComponent },
      { path: "resenias/editar/:id", component: ReseniaCrearEditarComponent },
      { path: "reservas", component: ReservaListarComponent },
      { path: "reservas/crear", component: ReservaCrearEditarComponent },
      { path: "reservas/editar/:id", component: ReservaCrearEditarComponent },
      { path: "pagos", component: PagoListarComponent },
      { path: "pagos/crear", component: PagoCrearEditarComponent },
      { path: "pagos/editar/:id", component: PagoCrearEditarComponent },
      { path: "ubicaciones", component: UbicacionListarComponent },
      { path: "ubicaciones/crear", component: UbicacionCrearEditarComponent },
      { path: "ubicaciones/editar/:id", component: UbicacionCrearEditarComponent },
      { path: "reportes", component: ReportesComponent },
    ],
  },
]