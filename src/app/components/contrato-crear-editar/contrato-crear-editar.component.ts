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
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { Contrato } from "../../models/contrato"
import { Usuario } from "../../models/usuario"
import { Ubicacion } from "../../models/ubicacion"
import { ContratoService } from "../../services/contrato.service"
import { UsuarioService } from "../../services/usuario.service"
import { UbicacionService } from "../../services/ubicacion.service"

@Component({
  selector: "app-contrato-crear-editar",
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
    MatSnackBarModule,
  ],
  templateUrl: "./contrato-crear-editar.component.html",
  styleUrls: ["./contrato-crear-editar.component.css"],
})
export class ContratoCrearEditarComponent implements OnInit {
  contratoForm!: FormGroup
  usuarios: Usuario[] = []
  ubicaciones: Ubicacion[] = []
  isEditing = false
  contratoId: number | null = null
  loading = false

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private contratoService: ContratoService,
    private usuarioService: UsuarioService,
    private ubicacionService: UbicacionService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.initForm()
    this.cargarDatos()

    const id = this.route.snapshot.paramMap.get("id")
    if (id) {
      this.isEditing = true
      this.contratoId = +id
      this.cargarContrato(this.contratoId)
    }
  }

  initForm(): void {
    this.contratoForm = this.formBuilder.group({
      fechaInicio: ["", [Validators.required]],
      fechaFinal: ["", [Validators.required]],
      archivo: [""],
      descripcionContrato: ["", [Validators.required, Validators.maxLength(500)]],
      contratante: ["", [Validators.required]],
      contratado: ["", [Validators.required]],
      ubicacion: ["", [Validators.required]],
    })
  }

  cargarDatos(): void {
    // Cargar usuarios
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarios = data
      },
      error: (error) => {
        this.snackBar.open("Error al cargar usuarios", "Cerrar", {
          duration: 3000,
        })
      },
    })

    // Cargar ubicaciones
    this.ubicacionService.listar().subscribe({
      next: (data) => {
        this.ubicaciones = data
      },
      error: (error) => {
        this.snackBar.open("Error al cargar ubicaciones", "Cerrar", {
          duration: 3000,
        })
      },
    })
  }

  cargarContrato(id: number): void {
    this.contratoService.buscarPorId(id).subscribe({
      next: (contrato) => {
        this.contratoForm.patchValue({
          fechaInicio: contrato.fechaInicio,
          fechaFinal: contrato.fechaFinal,
          archivo: contrato.archivo,
          descripcionContrato: contrato.descripcionContrato,
          contratante: contrato.contratante?.idUsuario,
          contratado: contrato.contratado?.idUsuario,
          ubicacion: contrato.ubicacion?.idUbicacion,
        })
      },
      error: (error) => {
        this.snackBar.open("Error al cargar contrato", "Cerrar", {
          duration: 3000,
        })
      },
    })
  }

  onSubmit(): void {
    if (this.contratoForm.valid) {
      this.loading = true
      const formData = this.contratoForm.value

      const contrato: Contrato = {
        idContrato: this.contratoId || 0,
        fechaInicio: formData.fechaInicio,
        fechaFinal: formData.fechaFinal,
        archivo: formData.archivo || "",
        descripcionContrato: formData.descripcionContrato,
        contratante: this.usuarios.find((u) => u.idUsuario === formData.contratante)!,
        contratado: this.usuarios.find((u) => u.idUsuario === formData.contratado)!,
        ubicacion: this.ubicaciones.find((u) => u.idUbicacion === formData.ubicacion)!,
      }

      const operation = this.isEditing
        ? this.contratoService.modificar(contrato)
        : this.contratoService.registrar(contrato)

      operation.subscribe({
        next: () => {
          this.snackBar.open(`Contrato ${this.isEditing ? "actualizado" : "creado"} correctamente`, "Cerrar", {
            duration: 3000,
          })
          this.router.navigate(["/contratos"])
        },
        error: (error) => {
          this.snackBar.open("Error al guardar contrato", "Cerrar", {
            duration: 3000,
          })
          this.loading = false
        },
      })
    }
  }

  volver(): void {
    this.router.navigate(["/contratos"])
  }
}
