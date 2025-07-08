import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { Router, ActivatedRoute } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { AuthService } from "../../services/auth.service"
import { MatIconModule } from "@angular/material/icon"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup
  loading = false
  submitted = false
  returnUrl!: string
  hidePassword = true

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    })

    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/inicio"
  }

  get f() {
    return this.loginForm.controls
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  onSubmit() {
    this.submitted = true

    if (this.loginForm.invalid) {
      return
    }

    this.loading = true
    this.authService.login(this.loginForm.value).subscribe({
      next: (data) => {
        this.router.navigate([this.returnUrl])
      },
      error: (error) => {
        this.snackBar.open("Error en las credenciales", "Cerrar", {
          duration: 3000,
        })
        this.loading = false
      },
    })
  }
}
