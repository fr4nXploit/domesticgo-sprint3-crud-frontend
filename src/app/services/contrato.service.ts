import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable } from "rxjs"
import { Contrato } from "../models/contrato"
import { environment } from "../../environments/environment"
import { AuthService } from "./auth.service"

export interface ServiciosContratadosDTO {
  mes: string
  cantidad: number
  tipoServicio: string
}

export interface ClientesRecurrentesDTO {
  totalClientes: number
  clientesRecurrentes: { cliente: string; servicios: number }[]
}

@Injectable({
  providedIn: "root",
})
export class ContratoService {
  private apiUrl = `${environment.apiUrl}/contratos`

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

  // CRUD básico
  listar(): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(`${this.apiUrl}/listado`, { headers: this.getHeaders() })
  }

  buscarPorId(id: number): Observable<Contrato> {
    return this.http.get<Contrato>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
  }

  registrar(contrato: Contrato): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/registrar`, contrato, { headers: this.getHeaders() })
  }

  modificar(contrato: Contrato): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/modificar`, contrato, { headers: this.getHeaders() })
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
  }

  // Reportes disponibles
  obtenerServiciosPorMes(mes: number, anio: number): Observable<ServiciosContratadosDTO[]> {
    return this.http.get<ServiciosContratadosDTO[]>(`${this.apiUrl}/servicios-por-mes?mes=${mes}&anio=${anio}`, {
      headers: this.getHeaders(),
    })
  }

  obtenerClientesRecurrentes(): Observable<ClientesRecurrentesDTO> {
    return this.http.get<ClientesRecurrentesDTO>(`${this.apiUrl}/clientes-recurrentes`, {
      headers: this.getHeaders(),
    })
  }
}
