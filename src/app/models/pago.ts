import { Contrato } from "./contrato"

export interface Pago {
  idPago: number
  tipoPago: string
  tipoComprobante: string
  bancoPago: string
  fechaPago: Date
  montoPago: number
  contrato: Contrato
}
