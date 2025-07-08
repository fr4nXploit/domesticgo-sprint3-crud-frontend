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

import { Resenia } from "../../models/resenia"
import { Usuario } from "../../models/usuario"
import { Servicio } from "../../models/servicio"
import { ReseniaService } from "../../services/resenia.service"
import { UsuarioService } from "../../services/usuario.service"
import { ServicioService } from "../../services/servicio.service"
import { ErrorHandlerService } from "../../services/error-handler.service"

@Component({
  selector: "app-resenia-crear-editar",
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
  templateUrl: "./resenia-crear-editar.component.html",
  styleUrls: ["./resenia-crear-editar.component.css"],
})
export class ReseniaCrearEditarComponent implements OnInit {
  reseniaForm!: FormGroup
  usuarios: Usuario[] = []
  servicios: Servicio[] = []
  isEditing = false
  reseniaId: number | null = null
  loading = false

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private reseniaService: ReseniaService,
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
      this.reseniaId = +id
      this.cargarResenia(this.reseniaId)
    }
  }

  initForm(): void {
    this.reseniaForm = this.formBuilder.group({
      fechaResenia: [new Date(), [Validators.required]],
      detalleResenia: ["", [Validators.required, Validators.maxLength(500)]],
      usuario: ["", [Validators.required]],
      servicio: ["", [Validators.required]],
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

    this.servicioService.listar().subscribe({
      next: (data) => {
        this.servicios = data
      },
      error: (error) => {
        this.errorHandler.handleError(error)
      },
    })
  }

  cargarResenia(id: number): void {
    this.reseniaService.buscarPorId(id).subscribe({
      next: (resenia) => {
        this.reseniaForm.patchValue({
          fechaResenia: new Date(resenia.fechaResenia),
          detalleResenia: resenia.detalleResenia,
          usuario: resenia.usuario?.idUsuario,
          servicio: resenia.servicio?.idServicio,
        })
      },
      error: (error) => {
        this.errorHandler.handleError(error)
      },
    })
  }

  onSubmit(): void {
    if (this.reseniaForm.valid) {
      this.loading = true
      const formData = this.reseniaForm.value

      const resenia: Resenia = {
        idResenia: this.reseniaId || 0,
        fechaResenia: formData.fechaResenia,
        detalleResenia: formData.detalleResenia,
        usuario: this.usuarios.find((u) => u.idUsuario === formData.usuario)!,
        servicio: this.servicios.find((s) => s.idServicio === formData.servicio)!,
      }

      const operation = this.isEditing ? this.reseniaService.modificar(resenia) : this.reseniaService.registrar(resenia)

      operation.subscribe({
        next: () => {
          this.errorHandler.showSuccess(`Reseña ${this.isEditing ? "actualizada" : "creada"} correctamente`)
          this.router.navigate(["/resenias"])
        },
        error: (error) => {
          this.errorHandler.handleError(error)
          this.loading = false
        },
      })
    }
  }

  volver(): void {
    this.router.navigate(["/resenias"])
  }

  getNombreCompleto(usuario: Usuario): string {
    return `${usuario.nombres} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`.trim()
  }
}
