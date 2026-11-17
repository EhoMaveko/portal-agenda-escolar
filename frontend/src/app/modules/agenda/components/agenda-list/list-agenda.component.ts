import { Component, EventEmitter, Input, Output } from '@angular/core';
import { COMMONS_MODULES } from '../../../../shared';

export interface Agenda {
  id: number;
  perfil_id: number;
  titulo: string;
  descricao: string | null;
  data_evento: string;
  status: string;
}

@Component({
  selector: 'app-list-agenda',
  imports: [COMMONS_MODULES],
  templateUrl: './list-agenda.component.html',
  styleUrl: './list-agenda.component.css'
})
export class ListAgendaComponent {
  @Input() agendas: Agenda[] = [];
  @Input() carregando = false;
  @Input() erro = '';

  @Output() selecionar = new EventEmitter<number>();
}
