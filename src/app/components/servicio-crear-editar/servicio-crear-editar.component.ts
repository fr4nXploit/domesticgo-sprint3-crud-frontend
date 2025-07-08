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
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { Servicio } from "../../models/servicio"
import { Contrato } from "../../models/contrato"
import { Reserva } from "../../models/reserva"
import { ServicioService } from "../../services/servicio.service"
import { ContratoService } from "../../services/contrato.service"
import { ReservaService } from "../../services/reserva.service"

@Component({
  selector: "app-servicio-crear-editar",
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
    MatSnackBarModule,
  ],
  templateUrl: "./servicio-crear-editar.component.html",
  styleUrls: ["./servicio-crear-editar.component.css"],
})
export class ServicioCrearEditarComponent implements OnInit {
  servicioForm!: FormGroup
  contratos: Contrato[] = []
  reservas: Reserva[] = []
  isEditing = false
  servicioId: number | null = null
  loading = false

  estadosServicio = [
    { value: "PENDIENTE", label: "Pendiente" },
    { value: "ACTIVO", label: "Activo" },
    { value: "COMPLETADO", label: "Completado" },
    { value: "CANCELADO", label: "Cancelado" },
  ]

  tiposServicio = [
    { value: "LIMPIEZA", label: "Limpieza" },
    { value: "JARDINERIA", label: "Jardinería" },
    { value: "PLOMERIA", label: "Plomería" },
    { value: "ELECTRICIDAD", label: "Electricidad" },
    { value: "PINTURA", label: "Pintura" },
    { value: "CARPINTERIA", label: "Carpintería" },
    { value: "COCINA", label: "Cocina" },
    { value: "CUIDADO_NIÑOS", label: "Cuidado de Niños" },
    { value: "CUIDADO_ADULTOS", label: "Cuidado de Adultos" },
    { value: "OTROS", label: "Otros" },
  ]

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private servicioService: ServicioService,
    private contratoService: ContratoService,
    private reservaService: ReservaService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.initForm()
    this.cargarDatos()

    const id = this.route.snapshot.paramMap.get("id")
    if (id) {
      this.isEditing = true
      this.servicioId = +id
      this.cargarServicio(this.servicioId)
    }
  }

  initForm(): void {
    this.servicioForm = this.formBuilder.group({
      estadoServicio: ["", [Validators.required]],
      tipoServicio: ["", [Validators.required]],
      contrato: ["", [Validators.required]],
      reserva: ["", [Validators.required]],
    })
  }

  cargarDatos(): void {
    // Cargar contratos
    this.contratoService.listar().subscribe({
      next: (data) => {
        this.contratos = data
      },
      error: (error) => {
        this.snackBar.open("Error al cargar contratos", "Cerrar", {
          duration: 3000,
        })
      },
    })

    // Cargar reservas
    this.reservaService.listar().subscribe({
      next: (data) => {
        this.reservas = data
      },
      error: (error) => {
        this.snackBar.open("Error al cargar reservas", "Cerrar", {
          duration: 3000,
        })
      },
    })
  }

  cargarServicio(id: number): void {
    this.servicioService.buscarPorId(id).subscribe({
      next: (servicio) => {
        this.servicioForm.patchValue({
          estadoServicio: servicio.estadoServicio,
          tipoServicio: servicio.tipoServicio,
          contrato: servicio.contrato?.idContrato,
          reserva: servicio.reserva?.idReserva,
        })
      },
      error: (error) => {
        this.snackBar.open("Error al cargar servicio", "Cerrar", {
          duration: 3000,
        })
      },
    })
  }

  onSubmit(): void {
    if (this.servicioForm.valid) {
      this.loading = true
      const formData = this.servicioForm.value

      const servicio: Servicio = {
        idServicio: this.servicioId || 0,
        estadoServicio: formData.estadoServicio,
        tipoServicio: formData.tipoServicio,
        contrato: this.contratos.find((c) => c.idContrato === formData.contrato)!,
        reserva: this.reservas.find((r) => r.idReserva === formData.reserva)!,
      }

      const operation = this.isEditing
        ? this.servicioService.modificar(servicio)
        : this.servicioService.registrar(servicio)

      operation.subscribe({
        next: () => {
          this.snackBar.open(`Servicio ${this.isEditing ? "actualizado" : "creado"} correctamente`, "Cerrar", {
            duration: 3000,
          })
          this.router.navigate(["/servicios"])
        },
        error: (error) => {
          this.snackBar.open("Error al guardar servicio", "Cerrar", {
            duration: 3000,
          })
          this.loading = false
        },
      })
    }
  }

  volver(): void {
    this.router.navigate(["/servicios"])
  }
}
