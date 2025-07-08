import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { Router, ActivatedRoute } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatNativeDateModule } from "@angular/material/core"

import { Reserva } from "../../models/reserva"
import { ReservaService } from "../../services/reserva.service"
import { ErrorHandlerService } from "../../services/error-handler.service"

@Component({
  selector: "app-reserva-crear-editar",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: "./reserva-crear-editar.component.html",
  styleUrls: ["./reserva-crear-editar.component.css"],
})
export class ReservaCrearEditarComponent implements OnInit {
  reservaForm!: FormGroup
  isEditing = false
  reservaId: number | null = null
  loading = false

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private reservaService: ReservaService,
    private errorHandler: ErrorHandlerService,
  ) {}

  ngOnInit(): void {
    this.initForm()
    const id = this.route.snapshot.paramMap.get("id")
    if (id) {
      this.isEditing = true
      this.reservaId = +id
      this.cargarReserva(this.reservaId)
    }
  }

  initForm(): void {
    this.reservaForm = this.formBuilder.group({
      fechaReserva: [new Date(), [Validators.required]],
      detalleReserva: ["", [Validators.required, Validators.maxLength(500)]],
    })
  }

  cargarReserva(id: number): void {
    this.reservaService.buscarPorId(id).subscribe({
      next: (reserva) => {
        this.reservaForm.patchValue({
          fechaReserva: new Date(reserva.fechaReserva),
          detalleReserva: reserva.detalleReserva,
        })
      },
      error: (error) => {
        this.errorHandler.handleError(error)
      },
    })
  }

  onSubmit(): void {
    if (this.reservaForm.valid) {
      this.loading = true
      const formData = this.reservaForm.value

      const reserva: Reserva = {
        idReserva: this.reservaId || 0,
        fechaReserva: formData.fechaReserva,
        detalleReserva: formData.detalleReserva,
      }

      const operation = this.isEditing ? this.reservaService.modificar(reserva) : this.reservaService.registrar(reserva)

      operation.subscribe({
        next: () => {
          this.errorHandler.showSuccess(`Reserva ${this.isEditing ? "actualizada" : "creada"} correctamente`)
          this.router.navigate(["/reservas"])
        },
        error: (error) => {
          this.errorHandler.handleError(error)
          this.loading = false
        },
      })
    }
  }

  volver(): void {
    this.router.navigate(["/reservas"])
  }
}
