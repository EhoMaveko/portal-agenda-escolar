
import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { COMMONS_MODULES } from '../../../../shared';

export interface Perfil {
  id: number;
  nome: string;
  tipo: string;
}

@Component({
  selector: 'app-form-agenda',
  imports: [COMMONS_MODULES],
  templateUrl: './form-agenda.component.html',
})
export class FormAgendaComponent implements OnChanges {
  @Input() perfis: Perfil[] = [];
  @Input() salvando = false;
  @Input() mensagem = '';

  @Output() cadastrar = new EventEmitter<{
    titulo: string;
    descricao: string;
    dataEvento: string;
    perfilId: number;
  }>();

  titulo = '';
  descricao = '';
  dataEvento = '';
  perfilId = 0;

ngOnChanges(): void {
  if (this.perfis.length > 0 && !this.perfis.some(p => p.id === this.perfilId)) {
    this.perfilId = this.perfis[0].id;
  }

  if (this.mensagem === 'Salvo com sucesso!') {
    this.limparFormulario();
  }
}

  enviarFormulario(): void {
    if (!this.titulo.trim() || !this.dataEvento || !this.perfilId) {
      return;
    }

    this.cadastrar.emit({
      titulo: this.titulo.trim(),
      descricao: this.descricao.trim(),
      dataEvento: this.dataEvento,
      perfilId: this.perfilId
    });
  }

  limparFormulario(): void {
    this.titulo = '';
    this.descricao = '';
    this.dataEvento = '';
  }
}
