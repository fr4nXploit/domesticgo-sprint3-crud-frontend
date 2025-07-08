import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable } from "rxjs"
import { Resenia } from "../models/resenia"
import { environment } from "../../environments/environment"
import { AuthService } from "./auth.service"

export interface ReseniasPorTrabajadorDTO {
  trabajador: string
  promedioCalificacion: number
  totalResenias: number
}

@Injectable({
  providedIn: "root",
})
export class ReseniaService {
  private apiUrl = `${environment.apiUrl}/resenias`

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

  listar(): Observable<Resenia[]> {
    return this.http.get<Resenia[]>(`${this.apiUrl}/listado`, { headers: this.getHeaders() })
  }

  buscarPorId(id: number): Observable<Resenia> {
    return this.http.get<Resenia>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
  }

  registrar(resenia: Resenia): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/registrar`, resenia, { headers: this.getHeaders() })
  }

  modificar(resenia: Resenia): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/modificar`, resenia, { headers: this.getHeaders() })
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
  }

  // Reporte disponible
  obtenerReseniasPorTrabajador(): Observable<ReseniasPorTrabajadorDTO[]> {
    return this.http.get<ReseniasPorTrabajadorDTO[]>(`${this.apiUrl}/resenias-por-trabajador`, {
      headers: this.getHeaders(),
    })
  }
}
