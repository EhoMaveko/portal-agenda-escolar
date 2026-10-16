import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Perfil {
  id: number;
  nome: string;
  tipo: string;
}

@Component({
  selector: 'app-agenda-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agenda-form.html',
  styleUrl: './agenda-form.css'
})
export class AgendaFormComponent {
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