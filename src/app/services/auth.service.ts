import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable, BehaviorSubject } from "rxjs"
import { map } from "rxjs/operators"
import { environment } from "../../environments/environment"

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  jwttoken: string
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = environment.apiUrl
  private currentUserSubject: BehaviorSubject<any>
  public currentUser: Observable<any>

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem("currentUser") || "{}"))
    this.currentUser = this.currentUserSubject.asObservable()
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      map((response) => {
        if (response && response.jwttoken) {
          // Decodificar el JWT para obtener los roles
          const payload = this.decodeJWT(response.jwttoken)
          const userInfo = {
            ...response,
            username: credentials.username,
            roles: payload.role || "",
          }
          localStorage.setItem("currentUser", JSON.stringify(userInfo))
          this.currentUserSubject.next(userInfo)
        }
        return response
      }),
    )
  }

  logout() {
    localStorage.removeItem("currentUser")
    this.currentUserSubject.next(null)
  }

  getToken(): string | null {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
    return currentUser?.jwttoken || null
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  hasRole(role: string): boolean {
    const currentUser = this.currentUserValue
    return currentUser?.roles?.includes(role) || false
  }

  isAdmin(): boolean {
    return this.hasRole("ADMIN")
  }

  isCliente(): boolean {
    return this.hasRole("CLIENTE")
  }

  private decodeJWT(token: string): any {
    try {
      const payload = token.split(".")[1]
      return JSON.parse(atob(payload))
    } catch (error) {
      return {}
    }
  }
}
