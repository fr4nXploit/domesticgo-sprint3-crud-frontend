import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterOutlet } from "@angular/router"
import { NavbarComponent } from "../navbar/navbar.component"

@Component({
  selector: "app-layout",
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <div class="layout-container">
      <app-navbar></app-navbar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .layout-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      
      .main-content {
        padding-top: 80px;
        min-height: calc(100vh - 80px);
      }
    `,
  ],
})
export class LayoutComponent {}
