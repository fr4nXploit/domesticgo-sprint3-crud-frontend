import { Usuario } from "./usuario"
import { Servicio } from "./servicio"

export interface Resenia {
  idResenia: number
  fechaResenia: Date
  detalleResenia: string
  usuario: Usuario
  servicio: Servicio
}
