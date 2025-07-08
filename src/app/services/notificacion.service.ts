import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable } from "rxjs"
import { Notificacion } from "../models/notificacion"
import { environment } from "../../environments/environment"
import { AuthService } from "./auth.service"

@Injectable({
  providedIn: "root",
})
export class NotificacionService {
  private apiUrl = `${environment.apiUrl}/notificaciones`

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

  listar(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.apiUrl}/listado`, { headers: this.getHeaders() })
  }

  buscarPorId(id: number): Observable<Notificacion> {
    return this.http.get<Notificacion>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
  }

  registrar(notificacion: Notificacion): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/registrar`, notificacion, { headers: this.getHeaders() })
  }

  modificar(notificacion: Notificacion): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/modificar`, notificacion, { headers: this.getHeaders() })
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
  }
}
