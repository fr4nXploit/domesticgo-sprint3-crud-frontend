import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  mobileMenuOpen = false;
  contactForm: FormGroup;

  services = [
    {
      emoji: '🔧',
      title: 'Fontanería',
      description: 'Reparaciones y mantenimiento de sistemas de agua y desagüe con garantía extendida.',
      features: ['Reparación de tuberías', 'Instalación de grifos', 'Destape de desagües', 'Mantenimiento preventivo'],
      price: 80
    },
    {
      emoji: '⚡',
      title: 'Electricidad',
      description: 'Instalaciones eléctricas seguras y reparaciones por técnicos certificados.',
      features: ['Instalación de luminarias', 'Reparación de tableros', 'Cableado residencial', 'Certificación técnica'],
      price: 100
    },
    {
      emoji: '🧹',
      title: 'Limpieza Profunda',
      description: 'Servicio de limpieza integral con productos ecológicos y equipos profesionales.',
      features: ['Limpieza de alfombras', 'Desinfección completa', 'Productos ecológicos', 'Equipo especializado'],
      price: 60
    },
    {
      emoji: '🔨',
      title: 'Carpintería',
      description: 'Trabajos de carpintería y ebanistería con acabados de alta calidad.',
      features: ['Muebles a medida', 'Reparación de puertas', 'Instalación de closets', 'Acabados premium'],
      price: 120
    },
    {
      emoji: '🎨',
      title: 'Pintura',
      description: 'Servicios de pintura interior y exterior con materiales de primera calidad.',
      features: ['Pintura interior/exterior', 'Preparación de superficies', 'Materiales premium', 'Garantía de color'],
      price: 90
    },
    {
      emoji: '❄️',
      title: 'Climatización',
      description: 'Instalación y mantenimiento de sistemas de aire acondicionado y calefacción.',
      features: ['Instalación de A/C', 'Mantenimiento preventivo', 'Reparación de equipos', 'Asesoría técnica'],
      price: 150
    }
  ];

  testimonials = [
    {
      name: 'María González',
      text: 'Excelente servicio de fontanería. Llegaron puntuales y resolvieron el problema rápidamente. Muy profesionales.',
      service: 'Fontanería',
      serviceEmoji: '🔧'
    },
    {
      name: 'Carlos Mendoza',
      text: 'El trabajo de pintura quedó perfecto. Usaron materiales de calidad y el acabado superó mis expectativas.',
      service: 'Pintura',
      serviceEmoji: '🎨'
    },
    {
      name: 'Ana Rodríguez',
      text: 'Servicio de limpieza impecable. Mi casa quedó como nueva y el personal fue muy cuidadoso con mis muebles.',
      service: 'Limpieza',
      serviceEmoji: '🧹'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.contactForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      mensaje: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.setupSmoothScrolling();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    this.mobileMenuOpen = false;
  }

  onSubmitContact(): void {
    if (this.contactForm.valid) {
      console.log('Formulario enviado:', this.contactForm.value);
      alert('¡Mensaje enviado correctamente! Te contactaremos pronto.');
      this.contactForm.reset();
    } else {
      alert('Por favor completa todos los campos correctamente.');
    }
  }

  private setupSmoothScrolling(): void {
    // Configuración adicional para scroll suave si es necesario
  }
}