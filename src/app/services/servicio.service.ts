import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable } from "rxjs"
import { Servicio } from "../models/servicio"
import { environment } from "../../environments/environment"
import { AuthService } from "./auth.service"

export interface ServiciosPendientesDTO {
  totalPendientes: number
  serviciosPorTipo: { tipo: string; cantidad: number }[]
}

export interface IngresosPorServicioDTO {
  tipoServicio: string
  ingresos: number
  cantidad: number
}

@Injectable({
  providedIn: "root",
})
export class ServicioService {
  private apiUrl = `${environment.apiUrl}/servicios`

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

  listar(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/listado`, { headers: this.getHeaders() })
  }

  buscarPorId(id: number): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
  }

  registrar(servicio: Servicio): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/registrar`, servicio, { headers: this.getHeaders() })
  }

  modificar(servicio: Servicio): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/modificar`, servicio, { headers: this.getHeaders() })
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
  }

  // Reportes disponibles
  obtenerServiciosPendientes(): Observable<ServiciosPendientesDTO> {
    return this.http.get<ServiciosPendientesDTO>(`${this.apiUrl}/servicios-pendientes`, {
      headers: this.getHeaders(),
    })
  }

  obtenerIngresosPorServicio(): Observable<IngresosPorServicioDTO[]> {
    return this.http.get<IngresosPorServicioDTO[]>(`${this.apiUrl}/ingresos-por-servicio`, {
      headers: this.getHeaders(),
    })
  }
}
