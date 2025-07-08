import { Usuario } from "./usuario"
import { Servicio } from "./servicio"

export interface Observacion {
  idObservacion: number
  fechaObservacion: Date
  detalleObservacion: string
  usuario: Usuario
  servicio: Servicio
}
