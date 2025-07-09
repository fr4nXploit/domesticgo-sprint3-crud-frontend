import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable } from "rxjs"
import { Pago } from "../models/pago"
import { environment } from "../../environments/environment"
import { AuthService } from "./auth.service"

export interface TotalPagosDTO {
  totalPagos: number
  pagosPorMes: { mes: string; total: number }[]
  pagosPorTipo: { tipo: string; total: number }[]
}

@Injectable({
  providedIn: "root",
})
export class PagoService {
  private apiUrl = `${environment.apiUrl}/pagos`

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

  listar(): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.apiUrl}/listado`, { headers: this.getHeaders() })
  }

  buscarPorId(id: number): Observable<Pago> {
    return this.http.get<Pago>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
  }

  registrar(pago: Pago): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/registrar`, pago, { headers: this.getHeaders() })
  }

  modificar(pago: Pago): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/modificar`, pago, { headers: this.getHeaders() })
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
  }

  // Reporte disponible
  obtenerTotalPagos(fechaInicio: string, fechaFin: string): Observable<TotalPagosDTO> {
    return this.http.get<TotalPagosDTO>(`${this.apiUrl}/Total-pagos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, {
      headers: this.getHeaders(),
    })
  }
}
