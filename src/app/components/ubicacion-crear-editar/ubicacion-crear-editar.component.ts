import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { Router, ActivatedRoute } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"

import { Ubicacion } from "../../models/ubicacion"
import { UbicacionService } from "../../services/ubicacion.service"
import { ErrorHandlerService } from "../../services/error-handler.service"

// Declarar Leaflet para TypeScript
declare var L: any

@Component({
  selector: "app-ubicacion-crear-editar",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: "./ubicacion-crear-editar.component.html",
  styleUrls: ["./ubicacion-crear-editar.component.css"],
})
export class UbicacionCrearEditarComponent implements OnInit, AfterViewInit {
  @ViewChild("mapContainer", { static: false }) mapContainer!: ElementRef

  ubicacionForm!: FormGroup
  loading = false
  isEditMode = false
  ubicacionId: number | null = null
  ubicacion: Ubicacion | null = null

  // Mapa
  private map: any
  private marker: any
  private isMapInitialized = false
  private ubicacionCargada = false

  // Coordenadas por defecto (Lima, Perú)
  private defaultLat = -12.046374
  private defaultLng = -77.042793

  constructor(
    private formBuilder: FormBuilder,
    private ubicacionService: UbicacionService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm()
    this.checkEditMode()
  }

  ngAfterViewInit(): void {
    // Cargar Leaflet y luego inicializar el mapa
    this.loadLeafletScript()
  }

  initForm(): void {
    this.ubicacionForm = this.formBuilder.group({
      direccion: ["", [Validators.required, Validators.maxLength(500)]],
      latitud: ["", [Validators.required]],
      longitud: ["", [Validators.required]],
      enlaceUbicacion: ["", [Validators.maxLength(1000)]],
    })
  }

  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get("id")
    if (id) {
      this.isEditMode = true
      this.ubicacionId = Number.parseInt(id, 10)
      this.cargarUbicacion()
    }
  }

  loadLeafletScript(): void {
    // Cargar CSS de Leaflet
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)
    }

    // Cargar JS de Leaflet
  if (typeof L === "undefined") {
      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.onload = () => {
        setTimeout(() => this.initMap(), 200)
      }
      document.head.appendChild(script)
    } else {
      setTimeout(() => this.initMap(), 200)
    }
  }

  cargarUbicacion(): void {
    if (!this.ubicacionId) return

    this.loading = true
    this.ubicacionService.buscarPorId(this.ubicacionId).subscribe({
      next: (ubicacion) => {
        this.ubicacion = ubicacion
        this.ubicacionForm.patchValue({
          direccion: ubicacion.direccion,
          latitud: ubicacion.latitud,
          longitud: ubicacion.longitud,
          enlaceUbicacion: ubicacion.enlaceUbicacion || "",
        })
        this.ubicacionCargada = true

        // Si el mapa ya está inicializado, actualizar la posición
        if (this.isMapInitialized) {
          const lat = Number.parseFloat(ubicacion.latitud)
          const lng = Number.parseFloat(ubicacion.longitud)
          this.actualizarPosicionMapa(lat, lng)
        }

        this.loading = false
      },
      error: (error) => {
        this.errorHandler.handleError(error)
        this.loading = false
      },
    })
  }

  initMap(): void {
  if (!this.mapContainer || typeof L === "undefined") return

    try {
      // Determinar coordenadas iniciales
      let initialLat = this.defaultLat
      let initialLng = this.defaultLng

      if (this.ubicacionCargada && this.ubicacion) {
        initialLat = Number.parseFloat(this.ubicacion.latitud)
        initialLng = Number.parseFloat(this.ubicacion.longitud)
      }

      // Crear el mapa
      this.map = L.map(this.mapContainer.nativeElement).setView([initialLat, initialLng], 13)

      // Agregar capa de tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map)

      // Crear marcador inicial
      this.marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(this.map)

      // Eventos del mapa
      this.map.on("click", (e: any) => {
        this.actualizarMarcador(e.latlng.lat, e.latlng.lng)
      })

      this.marker.on("dragend", () => {
        const position = this.marker.getLatLng()
        this.actualizarFormulario(position.lat, position.lng)
        this.buscarDireccion(position.lat, position.lng)
      })

      this.isMapInitialized = true

      // Actualizar formulario con coordenadas iniciales
      this.actualizarFormulario(initialLat, initialLng)

      // Si no hay ubicación cargada, buscar dirección para las coordenadas por defecto
      if (!this.ubicacionCargada) {
        this.buscarDireccion(initialLat, initialLng)
      }
    } catch (error) {
      console.error("Error al inicializar el mapa:", error)
      this.errorHandler.showError("Error al cargar el mapa")
    }
  }

  actualizarPosicionMapa(lat: number, lng: number): void {
    if (!this.isMapInitialized) return

    this.map.setView([lat, lng], 13)
    this.marker.setLatLng([lat, lng])
    this.actualizarFormulario(lat, lng)
  }

  actualizarMarcador(lat: number, lng: number): void {
    this.marker.setLatLng([lat, lng])
    this.actualizarFormulario(lat, lng)
    this.buscarDireccion(lat, lng)
  }

  actualizarFormulario(lat: number, lng: number): void {
    this.ubicacionForm.patchValue({
      latitud: lat.toFixed(6),
      longitud: lng.toFixed(6),
    })
  }

  buscarDireccion(lat: number, lng: number): void {
    // Geocodificación inversa usando Nominatim
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.display_name && !this.isEditMode) {
          this.ubicacionForm.patchValue({
            direccion: data.display_name,
          })
        }
      })
      .catch((error) => {
        console.error("Error en geocodificación:", error)
      })
  }

  buscarPorDireccion(): void {
    const direccion = this.ubicacionForm.get("direccion")?.value
    if (!direccion) {
      this.errorHandler.showWarning("Por favor, ingrese una dirección para buscar")
      return
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}&limit=1`

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          const lat = Number.parseFloat(data[0].lat)
          const lng = Number.parseFloat(data[0].lon)
          this.actualizarMarcador(lat, lng)
          this.map.setView([lat, lng], 15)
        } else {
          this.errorHandler.showWarning("No se encontró la dirección especificada")
        }
      })
      .catch((error) => {
        console.error("Error en búsqueda:", error)
        this.errorHandler.showError("Error al buscar la dirección")
      })
  }

  obtenerUbicacionActual(): void {
    if (navigator.geolocation) {
      this.loading = true
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          this.actualizarMarcador(lat, lng)
          this.map.setView([lat, lng], 15)
          this.loading = false
        },
        (error) => {
          console.error("Error al obtener ubicación:", error)
          this.errorHandler.showWarning("No se pudo obtener la ubicación actual")
          this.loading = false
        },
      )
    } else {
      this.errorHandler.showWarning("La geolocalización no está soportada en este navegador")
    }
  }

  onSubmit(): void {
    if (this.ubicacionForm.valid) {
      this.loading = true

      const ubicacionData: Ubicacion = {
        idUbicacion: this.ubicacionId || 0,
        direccion: this.ubicacionForm.get("direccion")?.value,
        latitud: this.ubicacionForm.get("latitud")?.value,
        longitud: this.ubicacionForm.get("longitud")?.value,
        enlaceUbicacion: this.ubicacionForm.get("enlaceUbicacion")?.value || "",
      }

      const operation = this.isEditMode
        ? this.ubicacionService.modificar(ubicacionData)
        : this.ubicacionService.registrar(ubicacionData)

      operation.subscribe({
        next: () => {
          const mensaje = this.isEditMode ? "Ubicación actualizada correctamente" : "Ubicación creada correctamente"
          this.errorHandler.showSuccess(mensaje)
          this.router.navigate(["/ubicaciones"])
        },
        error: (error) => {
          this.errorHandler.handleError(error)
          this.loading = false
        },
      })
    } else {
      this.errorHandler.showWarning("Por favor, complete todos los campos requeridos")
    }
  }

  cancelar(): void {
    this.router.navigate(["/ubicaciones"])
  }

  get tituloFormulario(): string {
    return this.isEditMode ? "Editar Ubicación" : "Crear Nueva Ubicación"
  }

  get textoBoton(): string {
    return this.isEditMode ? "Actualizar" : "Crear"
  }
}
