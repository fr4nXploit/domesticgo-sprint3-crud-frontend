import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { Router, ActivatedRoute } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatIconModule } from "@angular/material/icon"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { Empleo } from "../../models/empleo"
import { EmpleoService } from "../../services/empleo.service"

@Component({
  selector: "app-empleo-crear-editar",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: "./empleo-crear-editar.component.html",
  styleUrls: ["./empleo-crear-editar.component.css"],
})
export class EmpleoCrearEditarComponent implements OnInit {
  empleoForm!: FormGroup
  isEditing = false
  empleoId: number | null = null
  loading = false

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private empleoService: EmpleoService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.initForm()

    const id = this.route.snapshot.paramMap.get("id")
    if (id) {
      this.isEditing = true
      this.empleoId = +id
      this.cargarEmpleo(this.empleoId)
    }
  }

  initForm(): void {
    this.empleoForm = this.formBuilder.group({
      nombreEmpleo: ["", [Validators.required, Validators.maxLength(50)]],
    })
  }

  cargarEmpleo(id: number): void {
    this.empleoService.buscarPorId(id).subscribe({
      next: (empleo) => {
        this.empleoForm.patchValue({
          nombreEmpleo: empleo.nombreEmpleo,
        })
      },
      error: (error) => {
        this.snackBar.open("Error al cargar empleo", "Cerrar", {
          duration: 3000,
        })
      },
    })
  }

  onSubmit(): void {
    if (this.empleoForm.valid) {
      this.loading = true
      const formData = this.empleoForm.value

      const empleo: Empleo = {
        idEmpleo: this.empleoId || 0,
        nombreEmpleo: formData.nombreEmpleo,
      }

      const operation = this.isEditing ? this.empleoService.modificar(empleo) : this.empleoService.registrar(empleo)

      operation.subscribe({
        next: () => {
          this.snackBar.open(`Empleo ${this.isEditing ? "actualizado" : "creado"} correctamente`, "Cerrar", {
            duration: 3000,
          })
          this.router.navigate(["/empleos"])
        },
        error: (error) => {
          this.snackBar.open("Error al guardar empleo", "Cerrar", {
            duration: 3000,
          })
          this.loading = false
        },
      })
    }
  }

  volver(): void {
    this.router.navigate(["/empleos"])
  }
}
