import { Contrato } from "./contrato"
import { Reserva } from "./reserva"

export interface Servicio {
  idServicio: number
  estadoServicio: string
  tipoServicio: string
  contrato: Contrato
  reserva: Reserva
}
