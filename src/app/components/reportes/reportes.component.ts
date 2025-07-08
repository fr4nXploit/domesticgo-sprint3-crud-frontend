import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatSelectModule } from "@angular/material/select"
import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatInputModule } from "@angular/material/input"
import { MatNativeDateModule } from "@angular/material/core"
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms"
import { Chart, ChartConfiguration, registerables } from "chart.js"
import { ReporteService } from "../../services/reporte.service"
import { ErrorHandlerService } from "../../services/error-handler.service"

Chart.register(...registerables)

// Interfaces para los datos reales que devuelve la API
interface ServiciosPorMesData {
  mes: number
  anio: number
  totalServicios: number
}

interface IngresosPorServicioData {
  tipoServicio: string
  totalIngresos: number
}

interface ClientesRecurrentesData {
  totalClientesRecurrentes: number
}

interface TotalPagosData {
  totalPagos: number
  pagosPorMes: { mes: string; total: number }[]
}

interface ReseniasPorTrabajadorData {
  trabajador: string
  promedioCalificacion: number
  totalResenias: number
}

interface ServiciosPendientesData {
  totalPendientes: number
  serviciosPorTipo: { tipo: string; cantidad: number }[]
}

@Component({
  selector: "app-reportes",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
  ],
  templateUrl: "./reportes.component.html",
  styleUrls: ["./reportes.component.css"],
})
export class ReportesComponent implements OnInit, AfterViewInit {
  @ViewChild("serviciosChart", { static: false }) serviciosChart!: ElementRef<HTMLCanvasElement>
  @ViewChild("clientesChart", { static: false }) clientesChart!: ElementRef<HTMLCanvasElement>
  @ViewChild("pagosChart", { static: false }) pagosChart!: ElementRef<HTMLCanvasElement>
  @ViewChild("reseniasChart", { static: false }) reseniasChart!: ElementRef<HTMLCanvasElement>
  @ViewChild("pendientesChart", { static: false }) pendientesChart!: ElementRef<HTMLCanvasElement>
  @ViewChild("ingresosChart", { static: false }) ingresosChart!: ElementRef<HTMLCanvasElement>

  tipoReporteSeleccionado = ""
  loading = false
  filtrosForm!: FormGroup

  // Datos de los reportes usando las interfaces correctas
  serviciosPorMes: ServiciosPorMesData[] = []
  clientesRecurrentes: ClientesRecurrentesData | null = null
  totalPagos: TotalPagosData | null = null
  reseniasPorTrabajador: ReseniasPorTrabajadorData[] = []
  serviciosPendientes: ServiciosPendientesData | null = null
  ingresosPorServicio: IngresosPorServicioData[] = []

  // Charts
  private charts: { [key: string]: Chart } = {}

  constructor(
    private route: ActivatedRoute,
    private reporteService: ReporteService,
    private errorHandler: ErrorHandlerService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.initFiltros()
    this.route.queryParams.subscribe((params) => {
      this.tipoReporteSeleccionado = params["tipo"] || "servicios"
      this.cargarReporte()
    })
  }

  ngAfterViewInit(): void {
    // Los gráficos se crearán después de cargar los datos
  }

  initFiltros(): void {
    const fechaActual = new Date()
    const fechaInicio = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1)
    const fechaFin = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0)

    this.filtrosForm = this.formBuilder.group({
      mes: [fechaActual.getMonth() + 1],
      anio: [fechaActual.getFullYear()],
      fechaInicio: [fechaInicio],
      fechaFin: [fechaFin],
    })
  }

  cargarReporte(): void {
    this.loading = true
    this.limpiarGraficos()

    switch (this.tipoReporteSeleccionado) {
      case "servicios":
        this.cargarReporteServicios()
        break
      case "clientes":
        this.cargarReporteClientes()
        break
      case "pagos":
        this.cargarReportePagos()
        break
      case "resenias":
        this.cargarReporteResenias()
        break
      case "pendientes":
        this.cargarReportePendientes()
        break
      case "ingresos":
        this.cargarReporteIngresos()
        break
      default:
        this.cargarReporteServicios()
    }
  }

  cargarReporteServicios(): void {
    const mes = this.filtrosForm.get("mes")?.value || new Date().getMonth() + 1
    const anio = this.filtrosForm.get("anio")?.value || new Date().getFullYear()

    this.reporteService.obtenerServiciosPorMes(mes, anio).subscribe({
      next: (data: any) => {
        this.serviciosPorMes = data
        this.loading = false
        setTimeout(() => this.crearGraficoServicios(), 100)
      },
      error: (error) => {
        this.errorHandler.handleError(error)
        this.loading = false
      },
    })
  }

  cargarReporteClientes(): void {
    this.reporteService.obtenerClientesRecurrentes().subscribe({
      next: (data: any) => {
        this.clientesRecurrentes = data
        this.loading = false
        setTimeout(() => this.crearGraficoClientes(), 100)
      },
      error: (error) => {
        this.errorHandler.handleError(error)
        this.loading = false
      },
    })
  }

  cargarReportePagos(): void {
    const fechaInicio = this.filtrosForm.get("fechaInicio")?.value
    const fechaFin = this.filtrosForm.get("fechaFin")?.value

    const fechaInicioStr = this.formatearFecha(fechaInicio)
    const fechaFinStr = this.formatearFecha(fechaFin)

    this.reporteService.obtenerTotalPagos(fechaInicioStr, fechaFinStr).subscribe({
      next: (data: any) => {
        this.totalPagos = data
        this.loading = false
        setTimeout(() => this.crearGraficoPagos(), 100)
      },
      error: (error) => {
        this.errorHandler.handleError(error)
        this.loading = false
      },
    })
  }

  cargarReporteResenias(): void {
    this.reporteService.obtenerReseniasPorTrabajador().subscribe({
      next: (data: any) => {
        this.reseniasPorTrabajador = data
        this.loading = false
        setTimeout(() => this.crearGraficoResenias(), 100)
      },
      error: (error) => {
        this.errorHandler.handleError(error)
        this.loading = false
      },
    })
  }

  cargarReportePendientes(): void {
    this.reporteService.obtenerServiciosPendientes().subscribe({
      next: (data: any) => {
        this.serviciosPendientes = data
        this.loading = false
        setTimeout(() => this.crearGraficoPendientes(), 100)
      },
      error: (error) => {
        this.errorHandler.handleError(error)
        this.loading = false
      },
    })
  }

  cargarReporteIngresos(): void {
    this.reporteService.obtenerIngresosPorServicio().subscribe({
      next: (data: any) => {
        this.ingresosPorServicio = data
        this.loading = false
        setTimeout(() => this.crearGraficoIngresos(), 100)
      },
      error: (error) => {
        this.errorHandler.handleError(error)
        this.loading = false
      },
    })
  }

  crearGraficoServicios(): void {
    if (!this.serviciosChart?.nativeElement || !this.serviciosPorMes?.length) return

    const ctx = this.serviciosChart.nativeElement.getContext("2d")
    if (!ctx) return

    const config: ChartConfiguration = {
      type: "bar",
      data: {
        labels: this.serviciosPorMes.map((item) => `${this.getNombreMes(item.mes)} ${item.anio}`),
        datasets: [
          {
            label: "Total de Servicios",
            data: this.serviciosPorMes.map((item) => item.totalServicios || 0),
            backgroundColor: "rgba(54, 162, 235, 0.8)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `Total de servicios: ${this.getTotalServicios()}`,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    }

    this.charts["servicios"] = new Chart(ctx, config)
  }

  crearGraficoClientes(): void {
    if (!this.clientesChart?.nativeElement || !this.clientesRecurrentes) return

    const ctx = this.clientesChart.nativeElement.getContext("2d")
    if (!ctx) return

    const config: ChartConfiguration = {
      type: "doughnut",
      data: {
        labels: ["Clientes Recurrentes"],
        datasets: [
          {
            data: [this.clientesRecurrentes.totalClientesRecurrentes || 0],
            backgroundColor: ["rgba(255, 99, 132, 0.8)"],
            borderColor: ["rgba(255, 99, 132, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `Total de clientes recurrentes: ${this.clientesRecurrentes.totalClientesRecurrentes || 0}`,
          },
        },
      },
    }

    this.charts["clientes"] = new Chart(ctx, config)
  }

  crearGraficoPagos(): void {
    if (!this.pagosChart?.nativeElement || !this.totalPagos) return

    const ctx = this.pagosChart.nativeElement.getContext("2d")
    if (!ctx) return

    const config: ChartConfiguration = {
      type: "bar",
      data: {
        labels: this.totalPagos.pagosPorMes?.map((item) => item.mes) || ["Total"],
        datasets: [
          {
            label: "Pagos ($)",
            data: this.totalPagos.pagosPorMes?.map((item) => item.total) || [this.totalPagos.totalPagos],
            backgroundColor: "rgba(75, 192, 192, 0.8)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `Monto total: $${this.totalPagos.totalPagos?.toLocaleString() || 0}`,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    }

    this.charts["pagos"] = new Chart(ctx, config)
  }

  crearGraficoResenias(): void {
    if (!this.reseniasChart?.nativeElement || !this.reseniasPorTrabajador?.length) return

    const ctx = this.reseniasChart.nativeElement.getContext("2d")
    if (!ctx) return

    const config: ChartConfiguration = {
      type: "bar",
      data: {
        labels: this.reseniasPorTrabajador.map((item) => item.trabajador || "Sin nombre"),
        datasets: [
          {
            label: "Promedio de Calificación",
            data: this.reseniasPorTrabajador.map((item) => item.promedioCalificacion || 0),
            backgroundColor: "rgba(153, 102, 255, 0.8)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `Trabajadores evaluados: ${this.reseniasPorTrabajador.length}`,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 5,
          },
        },
      },
    }

    this.charts["resenias"] = new Chart(ctx, config)
  }

  crearGraficoPendientes(): void {
    if (!this.pendientesChart?.nativeElement || !this.serviciosPendientes) return

    const ctx = this.pendientesChart.nativeElement.getContext("2d")
    if (!ctx) return

    const config: ChartConfiguration = {
      type: "doughnut",
      data: {
        labels: this.serviciosPendientes.serviciosPorTipo?.map((item) => item.tipo) || ["Pendientes"],
        datasets: [
          {
            data: this.serviciosPendientes.serviciosPorTipo?.map((item) => item.cantidad) || [
              this.serviciosPendientes.totalPendientes,
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.8)",
              "rgba(54, 162, 235, 0.8)",
              "rgba(255, 205, 86, 0.8)",
              "rgba(75, 192, 192, 0.8)",
              "rgba(153, 102, 255, 0.8)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 205, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `Total pendientes: ${this.serviciosPendientes.totalPendientes || 0}`,
          },
        },
      },
    }

    this.charts["pendientes"] = new Chart(ctx, config)
  }

  crearGraficoIngresos(): void {
    if (!this.ingresosChart?.nativeElement || !this.ingresosPorServicio?.length) return

    const ctx = this.ingresosChart.nativeElement.getContext("2d")
    if (!ctx) return

    const config: ChartConfiguration = {
      type: "bar",
      data: {
        labels: this.ingresosPorServicio.map((item) => item.tipoServicio || "Sin tipo"),
        datasets: [
          {
            label: "Ingresos ($)",
            data: this.ingresosPorServicio.map((item) => item.totalIngresos || 0),
            backgroundColor: "rgba(255, 159, 64, 0.8)",
            borderColor: "rgba(255, 159, 64, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `Ingresos totales: $${this.getTotalIngresos().toLocaleString()}`,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    }

    this.charts["ingresos"] = new Chart(ctx, config)
  }

  aplicarFiltros(): void {
    this.cargarReporte()
  }

  limpiarGraficos(): void {
    Object.values(this.charts).forEach((chart) => {
      if (chart) {
        chart.destroy()
      }
    })
    this.charts = {}
  }

  formatearFecha(fecha: Date): string {
    if (!fecha) return ""
    return fecha.toISOString().split("T")[0]
  }

  getNombreMes(numeroMes: number): string {
    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ]
    return meses[numeroMes - 1] || "Mes"
  }

  getTotalServicios(): number {
    return this.serviciosPorMes.reduce((sum, s) => sum + (s.totalServicios || 0), 0)
  }

  getTotalIngresos(): number {
    return this.ingresosPorServicio.reduce((sum, i) => sum + (i.totalIngresos || 0), 0)
  }

  get tituloReporte(): string {
    switch (this.tipoReporteSeleccionado) {
      case "servicios":
        return "Reporte de Servicios por Mes"
      case "clientes":
        return "Reporte de Clientes Recurrentes"
      case "pagos":
        return "Reporte de Pagos"
      case "resenias":
        return "Reporte de Reseñas por Trabajador"
      case "pendientes":
        return "Reporte de Servicios Pendientes"
      case "ingresos":
        return "Reporte de Ingresos por Servicio"
      default:
        return "Reportes"
    }
  }
}
