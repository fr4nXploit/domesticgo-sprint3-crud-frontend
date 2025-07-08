import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { Router, ActivatedRoute } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatNativeDateModule } from "@angular/material/core"

import { Notificacion } from "../../models/notificacion"
import { Usuario } from "../../models/usuario"
import { NotificacionService } from "../../services/notificacion.service"
import { UsuarioService } from "../../services/usuario.service"
import { ErrorHandlerService } from "../../services/error-handler.service"

@Component({
  selector: "app-notificacion-crear-editar",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: "./notificacion-crear-editar.component.html",
  styleUrls: ["./notificacion-crear-editar.component.css"],
})
export class NotificacionCrearEditarComponent implements OnInit {
  notificacionForm!: FormGroup
  usuarios: Usuario[] = []
  isEditing = false
  notificacionId: number | null = null
  loading = false

  tiposNotificacion = [
    { value: "INFORMACION", label: "Información" },
    { value: "ADVERTENCIA", label: "Advertencia" },
    { value: "ERROR", label: "Error" },
    { value: "EXITO", label: "Éxito" },
    { value: "RECORDATORIO", label: "Recordatorio" },
  ]

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private notificacionService: NotificacionService,
    private usuarioService: UsuarioService,
    private errorHandler: ErrorHandlerService,
  ) {}

  ngOnInit(): void {
    this.initForm()
    this.cargarDatos()
    const id = this.route.snapshot.paramMap.get("id")
    if (id) {
      this.isEditing = true
      this.notificacionId = +id
      this.cargarNotificacion(this.notificacionId)
    }
  }

  initForm(): void {
    this.notificacionForm = this.formBuilder.group({
      fechaNotificacion: [new Date(), [Validators.required]],
      detalleNotificacion: ["", [Validators.required, Validators.maxLength(500)]],
      usuario: ["", [Validators.required]],
      tipoNotificacion: ["INFORMACION", [Validators.required]],
    })
  }

  cargarDatos(): void {
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarios = data
      },
      error: (error) => {
        this.errorHandler.handleError(error)
      },
    })
  }

  cargarNotificacion(id: number): void {
    this.notificacionService.buscarPorId(id).subscribe({
      next: (notificacion) => {
        this.notificacionForm.patchValue({
          fechaNotificacion: new Date(notificacion.fechaNotificacion),
          detalleNotificacion: notificacion.detalleNotificacion,
          usuario: notificacion.usuario?.idUsuario,
          tipoNotificacion: "INFORMACION", // Default ya que no está en el modelo
        })
      },
      error: (error) => {
        this.errorHandler.handleError(error)
      },
    })
  }

  onSubmit(): void {
    if (this.notificacionForm.valid) {
      this.loading = true
      const formData = this.notificacionForm.value

      const notificacion: Notificacion = {
        idNotificacion: this.notificacionId || 0,
        fechaNotificacion: formData.fechaNotificacion,
        detalleNotificacion: formData.detalleNotificacion,
        usuario: this.usuarios.find((u) => u.idUsuario === formData.usuario)!,
      }

      const operation = this.isEditing
        ? this.notificacionService.modificar(notificacion)
        : this.notificacionService.registrar(notificacion)

      operation.subscribe({
        next: () => {
          this.errorHandler.showSuccess(`Notificación ${this.isEditing ? "actualizada" : "creada"} correctamente`)
          this.router.navigate(["/notificaciones"])
        },
        error: (error) => {
          this.errorHandler.handleError(error)
          this.loading = false
        },
      })
    }
  }

  volver(): void {
    this.router.navigate(["/notificaciones"])
  }

  getNombreCompleto(usuario: Usuario): string {
    return `${usuario.nombres} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`.trim()
  }
}
