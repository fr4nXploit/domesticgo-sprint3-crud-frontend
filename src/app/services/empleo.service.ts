import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable } from "rxjs"
import { Empleo } from "../models/empleo"
import { environment } from "../../environments/environment"
import { AuthService } from "./auth.service"

@Injectable({
  providedIn: "root",
})
export class EmpleoService {
  private apiUrl = `${environment.apiUrl}/empleos`

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

  listar(): Observable<Empleo[]> {
    return this.http.get<Empleo[]>(`${this.apiUrl}/listado`, { headers: this.getHeaders() })
  }

  buscarPorId(id: number): Observable<Empleo> {
    return this.http.get<Empleo>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
  }

  buscarPorNombre(nombre: string): Observable<Empleo[]> {
    return this.http.get<Empleo[]>(`${this.apiUrl}/buscar-empleo?n=${nombre}`, { headers: this.getHeaders() })
  }

  registrar(empleo: Empleo): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/registrar`, empleo, { headers: this.getHeaders() })
  }

  modificar(empleo: Empleo): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/modificar`, empleo, { headers: this.getHeaders() })
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
  }
}
