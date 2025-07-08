import { Injectable } from "@angular/core"
import { HttpErrorResponse } from "@angular/common/http"
import { MatSnackBar } from "@angular/material/snack-bar"

export interface ApiError {
  message: string
  code: string
  details?: any
  field?: string
}

@Injectable({
  providedIn: "root",
})
export class ErrorHandlerService {
  constructor(private snackBar: MatSnackBar) {}

  handleError(error: HttpErrorResponse): string {
    let errorMessage = "Ha ocurrido un error inesperado"

    if (error.error && error.error.message) {
      errorMessage = this.translateError(error.error)
    } else if (error.message) {
      errorMessage = error.message
    }

    // Mostrar el error en snackbar
    this.snackBar.open(errorMessage, "Cerrar", {
      duration: 5000,
      panelClass: ["error-snackbar"],
    })

    return errorMessage
  }

  private translateError(apiError: ApiError): string {
    const errorCode = apiError.code?.toLowerCase()
    const message = apiError.message

    // Errores de violación de llaves foráneas
    if (errorCode?.includes("foreign_key") || errorCode?.includes("fk_")) {
      return this.handleForeignKeyError(apiError)
    }

    // Errores de violación de llaves únicas
    if (errorCode?.includes("unique") || errorCode?.includes("duplicate")) {
      return this.handleUniqueConstraintError(apiError)
    }

    // Errores de validación
    if (errorCode?.includes("validation")) {
      return this.handleValidationError(apiError)
    }

    // Errores de autenticación
    if (errorCode?.includes("auth") || errorCode?.includes("unauthorized")) {
      return "No tienes permisos para realizar esta acción"
    }

    // Errores de no encontrado
    if (errorCode?.includes("not_found")) {
      return "El recurso solicitado no fue encontrado"
    }

    return message || "Error desconocido"
  }

  private handleForeignKeyError(apiError: ApiError): string {
    const field = apiError.field?.toLowerCase()
    const details = apiError.details

    if (field?.includes("usuario")) {
      return "No se puede completar la operación: El usuario seleccionado no existe o ha sido eliminado"
    }

    if (field?.includes("empleo")) {
      return "No se puede completar la operación: El empleo seleccionado no existe o ha sido eliminado"
    }

    if (field?.includes("contrato")) {
      return "No se puede completar la operación: El contrato seleccionado no existe o ha sido eliminado"
    }

    if (field?.includes("servicio")) {
      return "No se puede completar la operación: El servicio seleccionado no existe o ha sido eliminado"
    }

    if (field?.includes("ubicacion")) {
      return "No se puede completar la operación: La ubicación seleccionada no existe o ha sido eliminada"
    }

    if (field?.includes("reserva")) {
      return "No se puede completar la operación: La reserva seleccionada no existe o ha sido eliminada"
    }

    return "No se puede completar la operación: Existe una referencia a un registro que no existe"
  }

  private handleUniqueConstraintError(apiError: ApiError): string {
    const field = apiError.field?.toLowerCase()

    if (field?.includes("email")) {
      return "Este email ya está registrado en el sistema"
    }

    if (field?.includes("nombre")) {
      return "Ya existe un registro con este nombre"
    }

    return "Ya existe un registro con estos datos"
  }

  private handleValidationError(apiError: ApiError): string {
    const field = apiError.field?.toLowerCase()
    const message = apiError.message

    if (field && message) {
      return `Error en ${field}: ${message}`
    }

    return message || "Los datos ingresados no son válidos"
  }

  showSuccess(message: string): void {
    this.snackBar.open(message, "Cerrar", {
      duration: 3000,
      panelClass: ["success-snackbar"],
    })
  }

  showWarning(message: string): void {
    this.snackBar.open(message, "Cerrar", {
      duration: 4000,
      panelClass: ["warning-snackbar"],
    })
  }

  showInfo(message: string): void {
    this.snackBar.open(message, "Cerrar", {
      duration: 3000,
      panelClass: ["info-snackbar"],
    })
  }

  showError(message: string): void {
  this.snackBar.open(message, "Cerrar", {
    duration: 4000,
    panelClass: ["snack-error"],
  })
}

}
