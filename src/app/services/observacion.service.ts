import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable } from "rxjs"
import { Observacion } from "../models/observacion"
import { environment } from "../../environments/environment"
import { AuthService } from "./auth.service"

@Injectable({
  providedIn: "root",
})
export class ObservacionService {
  private apiUrl = `${environment.apiUrl}/observaciones`

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

  listar(): Observable<Observacion[]> {
    return this.http.get<Observacion[]>(`${this.apiUrl}/listado`, { headers: this.getHeaders() })
  }

  buscarPorId(id: number): Observable<Observacion> {
    return this.http.get<Observacion>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
  }

  registrar(observacion: Observacion): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/registrar`, observacion, { headers: this.getHeaders() })
  }

  modificar(observacion: Observacion): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/modificar`, observacion, { headers: this.getHeaders() })
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
  }
}
