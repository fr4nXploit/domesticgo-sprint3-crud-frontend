import { Empleo } from "./empleo"
import { Role } from "./role"

export interface Usuario {
  idUsuario: number
  nombres: string
  apellidoPaterno: string
  apellidoMaterno: string
  email: string
  foto: string
  role: Role
  empleo: Empleo
}
