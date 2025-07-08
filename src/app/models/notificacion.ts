import { Usuario } from "./usuario"

export interface Notificacion {
  idNotificacion: number
  fechaNotificacion: Date
  detalleNotificacion: string
  usuario: Usuario
}
