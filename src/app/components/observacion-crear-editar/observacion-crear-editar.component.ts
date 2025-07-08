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

import { Observacion } from "../../models/observacion"
import { Usuario } from "../../models/usuario"
import { Servicio } from "../../models/servicio"
import { ObservacionService } from "../../services/observacion.service"
import { UsuarioService } from "../../services/usuario.service"
import { ServicioService } from "../../services/servicio.service"
import { ErrorHandlerService } from "../../services/error-handler.service"

@Component({
  selector: "app-observacion-crear-editar",
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
  templateUrl: "./observacion-crear-editar.component.html",
  styleUrls: ["./observacion-crear-editar.component.css"],
})
export class ObservacionCrearEditarComponent implements OnInit {
  observacionForm!: FormGroup
  usuarios: Usuario[] = []
  servicios: Servicio[] = []
  isEditing = false
  observacionId: number | null = null
  loading = false

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private observacionService: ObservacionService,
    private usuarioService: UsuarioService,
    private servicioService: ServicioService,
    private errorHandler: ErrorHandlerService,
  ) {}

  ngOnInit(): void {
    this.initForm()
    this.cargarDatos()
    const id = this.route.snapshot.paramMap.get("id")
    if (id) {
      this.isEditing = true
      this.observacionId = +id
      this.cargarObservacion(this.observacionId)
    }
  }

  initForm(): void {
    this.observacionForm = this.formBuilder.group({
      fechaObservacion: [new Date(), [Validators.required]],
      detalleObservacion: ["", [Validators.required, Validators.maxLength(1000)]],
      usuario: ["", [Validators.required]],
      servicio: ["", [Validators.required]],
    })
  }

  cargarDatos(): void {
    // Cargar usuarios
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarios = data
      },
      error: (error) => {
        this.errorHandler.handleError(error)
      },
    })

    // Cargar servicios
    this.servicioService.listar().subscribe({
      next: (data) => {
        this.servicios = data
      },
      error: (error) => {
        this.errorHandler.handleError(error)
      },
    })
  }

  cargarObservacion(id: number): void {
    this.observacionService.buscarPorId(id).subscribe({
      next: (observacion) => {
        this.observacionForm.patchValue({
          fechaObservacion: new Date(observacion.fechaObservacion),
          detalleObservacion: observacion.detalleObservacion,
          usuario: observacion.usuario?.idUsuario,
          servicio: observacion.servicio?.idServicio,
        })
      },
      error: (error) => {
        this.errorHandler.handleError(error)
      },
    })
  }

  onSubmit(): void {
    if (this.observacionForm.valid) {
      this.loading = true
      const formData = this.observacionForm.value

      const observacion: Observacion = {
        idObservacion: this.observacionId || 0,
        fechaObservacion: formData.fechaObservacion,
        detalleObservacion: formData.detalleObservacion,
        usuario: this.usuarios.find((u) => u.idUsuario === formData.usuario)!,
        servicio: this.servicios.find((s) => s.idServicio === formData.servicio)!,
      }

      const operation = this.isEditing
        ? this.observacionService.modificar(observacion)
        : this.observacionService.registrar(observacion)

      operation.subscribe({
        next: () => {
          this.errorHandler.showSuccess(`Observación ${this.isEditing ? "actualizada" : "creada"} correctamente`)
          this.router.navigate(["/observaciones"])
        },
        error: (error) => {
          this.errorHandler.handleError(error)
          this.loading = false
        },
      })
    }
  }

  volver(): void {
    this.router.navigate(["/observaciones"])
  }

  getNombreCompleto(usuario: Usuario): string {
    return `${usuario.nombres} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`.trim()
  }

  getDescripcionServicio(servicio: Servicio): string {
    return `${servicio.tipoServicio} - ${servicio.estadoServicio}`
  }
}
