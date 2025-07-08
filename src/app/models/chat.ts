import { Usuario } from "./usuario"

export interface Chat {
  idChat: number
  fechaMensaje: Date
  detalleMensaje: string
  contratante: Usuario
  contratado: Usuario
}
