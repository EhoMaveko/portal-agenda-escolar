import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Agenda {
  id: number;
  perfil_id: number;
  titulo: string;
  descricao: string | null;
  data_evento: string;
  status: string;
}

@Component({
  selector: 'app-agenda-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agenda-list.html',
  styleUrl: './agenda-list.css'
})
export class AgendaListComponent {
  @Input() agendas: Agenda[] = [];
  @Input() carregando = false;
  @Input() erro = '';

  @Output() selecionar = new EventEmitter<number>();
}
