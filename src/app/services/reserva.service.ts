import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable } from "rxjs"
import { Reserva } from "../models/reserva"
import { environment } from "../../environments/environment"
import { AuthService } from "./auth.service"

@Injectable({
  providedIn: "root",
})
export class ReservaService {
  private apiUrl = `${environment.apiUrl}/reservas`

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

  listar(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}/listado`, { headers: this.getHeaders() })
  }

  buscarPorId(id: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
  }

  registrar(reserva: Reserva): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/registrar`, reserva, { headers: this.getHeaders() })
  }

  modificar(reserva: Reserva): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/modificar`, reserva, { headers: this.getHeaders() })
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
  }
}
