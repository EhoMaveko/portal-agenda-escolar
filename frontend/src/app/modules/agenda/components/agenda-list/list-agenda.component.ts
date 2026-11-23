import { Component, EventEmitter, Input, Output } from '@angular/core';
import { COMMONS_MODULES } from '../../../../shared';
import { TranslatePipe } from '@ngx-translate/core';


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
  imports: [COMMONS_MODULES, TranslatePipe],
  templateUrl: './list-agenda.component.html',
  styleUrl: './list-agenda.component.css'
})



export class ListAgendaComponent {
  @Input() public agendas: Agenda[] = [];
  @Input() public carregando = false;
  @Input() public erro = '';

  @Output() public selecionar = new EventEmitter<number>();
  @Output() public excluir = new EventEmitter<Agenda>();


}


