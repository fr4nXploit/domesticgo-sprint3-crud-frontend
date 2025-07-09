import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
  ],
  templateUrl: './chat-listar.component.html',
  styleUrls: ['./chat-listar.component.css']
})
export class ChatComponent {
  prompt: string = '';  // Mensaje enviado por el usuario
  respuesta: string = '';  // Respuesta de la IA
  isLoading = false;  // Flag para mostrar el spinner de carga
  messages: { sender: string, text: string }[] = [];  // Para almacenar mensajes de la conversación

  // Lista de preguntas sugeridas para mostrar como botones
  suggestedQuestions = [
    "¿Cuáles son los servicios de DomestiGo?",
    "¿Qué tipo de trabajadores verificados ofrece DomestiGo?",
    "¿Cuál es la misión de DomestiGo?",
    "¿Qué servicios ofrece DomestiGo para mi hogar?",
    "¿Cuál es la visión de DomestiGo?",
    "¿Que servicio requieres de DomestiGO?"
  ];

  // Palabras clave relacionadas con servicios domésticos
  trabajosRelacionados = ['hola','servicios', 'trabajadores', 'limpieza', 'cuidado', 'mantenimiento', 'hogar', 'jardinería', 'plomería', 'electricista', 'asistencia', 'cocina', 'organización'];

  constructor(private chatService: ChatService) {}

  // Método que maneja el envío de un mensaje de texto por el usuario
  enviarMensaje() {
    if (!this.prompt.trim()) {
      return;
    }
    this.messages.push({ sender: 'user', text: this.prompt });
    this.isLoading = true;
    const mensajeUsuario = this.prompt;
    this.prompt = '';  // Limpiar el campo de texto

    // Detectamos si la pregunta está relacionada con un servicio doméstico
    if (!this.esPreguntaRelacionada(mensajeUsuario)) {
      this.mensajeIrrelevante();
      return;
    }

    this.chatService.getResponse(mensajeUsuario).subscribe({
      next: (res) => {
        this.respuesta = res.candidates?.[0]?.content?.parts?.[0]?.text || 'Sin respuesta';

        // Limitar la longitud de la respuesta y agregar un "ver más"
        if (this.respuesta.length > 250) {
          this.respuesta = this.respuesta.slice(0, 250) + '...';
        }

        // Formatear la respuesta para que sea más breve y ordenada
        this.messages.push({ sender: 'ai', text: this.formatearRespuesta(this.respuesta) });
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.messages.push({ sender: 'ai', text: 'Hubo un error al consultar la IA.' });
        this.isLoading = false;
      },
    });
  }

  // Método para verificar si la pregunta es relevante
  esPreguntaRelacionada(pregunta: string): boolean {
    // Comprobamos si la pregunta contiene alguna palabra clave relacionada con los servicios de DomestiGo
    return this.trabajosRelacionados.some((palabra) => pregunta.toLowerCase().includes(palabra));
  }

  // Método para responder cuando la pregunta es irrelevante
  mensajeIrrelevante() {
    const mensaje = "DomestiGo se dedica a ofrecer servicios de trabajadores domésticos y mantenimiento del hogar. Si deseas obtener más información sobre nuestros servicios, por favor consulta los siguientes temas.";
    this.messages.push({ sender: 'ai', text: mensaje });
    this.isLoading = false;
  }

  // Método para formatear las respuestas y hacerlas más legibles
  formatearRespuesta(respuesta: string): string {
    const fragmentos = respuesta.split('. ');
    return fragmentos.map((frag) => `<p>${frag}</p>`).join('');
  }

  // Método que maneja el envío de una pregunta sugerida al hacer clic en ella
  enviarPregunta(question: string) {
    this.prompt = question;  // Asigna la pregunta seleccionada al campo de texto
    this.enviarMensaje();  // Envía el mensaje automáticamente
  }
}
