import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable } from "rxjs"
import { Usuario } from "../models/usuario"
import { environment } from "../../environments/environment"
import { AuthService } from "./auth.service"

@Injectable({
  providedIn: "root",
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/usuarios`

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

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/listado`, { headers: this.getHeaders() })
  }

  buscarPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
  }

  registrar(usuario: Usuario): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/registrar`, usuario, { headers: this.getHeaders() })
  }

  modificar(usuario: Usuario): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/modificar`, usuario, { headers: this.getHeaders() })
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
  }
}
