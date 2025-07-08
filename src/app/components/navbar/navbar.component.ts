import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router, RouterModule } from "@angular/router"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatMenuModule } from "@angular/material/menu"
import { MatBadgeModule } from "@angular/material/badge"
import { AuthService } from "../../services/auth.service"
import { MatDividerModule } from "@angular/material/divider"

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule
  ],
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  currentUser: any
  isAdmin = false
  isCliente = false

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user
      this.isAdmin = this.authService.isAdmin()
      this.isCliente = this.authService.isCliente()
    })
  }

  navigateToReportes(tipo: string) {
    this.router.navigate(['/reportes'], { queryParams: { tipo } });
  }

  logout() {
    this.authService.logout()
    this.router.navigate(["/login"])
  }

  navigateTo(route: string) {
    this.router.navigate([route])
  }
}
