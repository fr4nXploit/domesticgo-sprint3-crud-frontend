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

import { Pago } from "../../models/pago"
import { Contrato } from "../../models/contrato"
import { PagoService } from "../../services/pago.service"
import { UsuarioService } from "../../services/usuario.service"
import { ContratoService } from "../../services/contrato.service"
import { ErrorHandlerService } from "../../services/error-handler.service"

@Component({
  selector: "app-pago-crear-editar",
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
  templateUrl: "./pago-crear-editar.component.html",
  styleUrls: ["./pago-crear-editar.component.css"],
})
export class PagoCrearEditarComponent implements OnInit {
  pagoForm!: FormGroup
  contratos: Contrato[] = []
  isEditing = false
  pagoId: number | null = null
  loading = false

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private pagoService: PagoService,
    private usuarioService: UsuarioService,
    private contratoService: ContratoService,
    private errorHandler: ErrorHandlerService,
  ) {}

  ngOnInit(): void {
    this.initForm()
    this.cargarDatos()
    const id = this.route.snapshot.paramMap.get("id")
    if (id) {
      this.isEditing = true
      this.pagoId = +id
      this.cargarPago(this.pagoId)
    }
  }

  initForm(): void {
    this.pagoForm = this.formBuilder.group({
      fechaPago: [new Date(), [Validators.required]],
      montoPago: ["", [Validators.required, Validators.min(0.01)]],
      tipoPago: ["", [Validators.required]],
      tipoComprobante: ["", [Validators.required]],
      bancoPago: ["", [Validators.required]],
      contrato: ["", [Validators.required]],
    })
  }

  cargarDatos(): void {
    // Solo cargar contratos, no usuarios
    this.contratoService.listar().subscribe({
      next: (data) => {
        this.contratos = data
      },
      error: (error) => {
        this.errorHandler.handleError(error)
      },
    })
  }

  cargarPago(id: number): void {
    this.pagoService.buscarPorId(id).subscribe({
      next: (pago) => {
        this.pagoForm.patchValue({
          fechaPago: new Date(pago.fechaPago),
          montoPago: pago.montoPago,
          tipoPago: pago.tipoPago,
          tipoComprobante: pago.tipoComprobante,
          bancoPago: pago.bancoPago,
          contrato: pago.contrato?.idContrato,
        })
      },
      error: (error) => {
        this.errorHandler.handleError(error)
      },
    })
  }

  onSubmit(): void {
    if (this.pagoForm.valid) {
      this.loading = true
      const formData = this.pagoForm.value

      const pago: Pago = {
        idPago: this.pagoId || 0,
        fechaPago: formData.fechaPago,
        montoPago: formData.montoPago,
        tipoPago: formData.tipoPago,
        tipoComprobante: formData.tipoComprobante,
        bancoPago: formData.bancoPago,
        contrato: this.contratos.find((c) => c.idContrato === formData.contrato)!,
      }

      const operation = this.isEditing ? this.pagoService.modificar(pago) : this.pagoService.registrar(pago)

      operation.subscribe({
        next: () => {
          this.errorHandler.showSuccess(`Pago ${this.isEditing ? "actualizado" : "creado"} correctamente`)
          this.router.navigate(["/pagos"])
        },
        error: (error) => {
          this.errorHandler.handleError(error)
          this.loading = false
        },
      })
    }
  }

  volver(): void {
    this.router.navigate(["/pagos"])
  }
}
