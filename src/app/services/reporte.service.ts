import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable } from "rxjs"
import { environment } from "../../environments/environment"
import { AuthService } from "./auth.service"

// Importar DTOs de otros servicios
import { ServiciosContratadosDTO, ClientesRecurrentesDTO } from "./contrato.service"
import { TotalPagosDTO } from "./pago.service"
import { ReseniasPorTrabajadorDTO } from "./resenia.service"
import { ServiciosPendientesDTO, IngresosPorServicioDTO } from "./servicio.service"

@Injectable({
  providedIn: "root",
})
export class ReporteService {
  private apiUrl = `${environment.apiUrl}`

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken()
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    })
  }

  // Reportes de contratos
  obtenerServiciosPorMes(mes: number, anio: number): Observable<ServiciosContratadosDTO[]> {
    return this.http.get<ServiciosContratadosDTO[]>(
      `${this.apiUrl}/contratos/servicios-por-mes?mes=${mes}&anio=${anio}`,
      { headers: this.getHeaders() },
    )
  }

  obtenerClientesRecurrentes(): Observable<ClientesRecurrentesDTO> {
    return this.http.get<ClientesRecurrentesDTO>(`${this.apiUrl}/contratos/clientes-recurrentes`, {
      headers: this.getHeaders(),
    })
  }

  // Reportes de pagos
  obtenerTotalPagos(fechaInicio: string, fechaFin: string): Observable<TotalPagosDTO> {
    return this.http.get<TotalPagosDTO>(
      `${this.apiUrl}/pagos/total-pagos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
      { headers: this.getHeaders() },
    )
  }

  // Reportes de reseñas
  obtenerReseniasPorTrabajador(): Observable<ReseniasPorTrabajadorDTO[]> {
    return this.http.get<ReseniasPorTrabajadorDTO[]>(`${this.apiUrl}/resenias/resenias-por-trabajador`, {
      headers: this.getHeaders(),
    })
  }

  // Reportes de servicios
  obtenerServiciosPendientes(): Observable<ServiciosPendientesDTO> {
    return this.http.get<ServiciosPendientesDTO>(`${this.apiUrl}/servicios/servicios-pendientes`, {
      headers: this.getHeaders(),
    })
  }

  obtenerIngresosPorServicio(): Observable<IngresosPorServicioDTO[]> {
    return this.http.get<IngresosPorServicioDTO[]>(`${this.apiUrl}/servicios/ingresos-por-servicio`, {
      headers: this.getHeaders(),
    })
  }
}
