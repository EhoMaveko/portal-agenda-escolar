import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DialogRef, Dialog } from '@angular/cdk/dialog';

export interface RespostaAgenda {
  id: number;
  agenda_id: number;
  aluno_nome: string;
  comentario: string | null;
  arquivo_path: string | null;
  created_at: string;
}

export type FormularioRespostaAgenda = FormGroup<{
  nomeAluno: FormControl<string>;
  comentarioResposta: FormControl<string>;
  arquivoSelecionado: FormControl<File | null>;
}>;

@Component({
  standalone: true,
  selector: 'app-answer-agenda',
  imports: [CommonModule, DatePipe, ReactiveFormsModule, TranslatePipe, AngularSvgIconModule],
  templateUrl: './answer-agenda.component.html',
})
export class AnswerAgendaComponent {
  @Input({ required: true }) public formulario!: FormularioRespostaAgenda;
  @Input() public enviandoResposta = false;
  @Input() public mensagemResposta = '';
  @Input() public respostas: RespostaAgenda[] = [];
  @Input() public carregandoRespostas = false;
  @Input() public formatoData = 'dd/MM/yyyy HH:mm';
  @Input() public arquivoSelecionado: File | null = null;
  @Input() public tituloAgenda = '';
  @Input() public descricaoAgenda: string | null = null;

  @Output() public enviar = new EventEmitter<void>();
  @Output() public fechar = new EventEmitter<void>();
  @Output() public arquivoAlterado = new EventEmitter<Event>();

  constructor (private _dialogRef: DialogRef, private _dialog: Dialog){
  }

  public onFechar(): void {
      this._dialogRef.close
    }

  public onObterErroNome(campo: AbstractControl): string | null {
    if (campo.hasError('required')) {
      return 'enviarResposta.nome-obrigatorio';
    }

    if (campo.hasError('minlength')) {
      return 'enviarResposta.nome-minimo';
    }

    return null;
  }

  public onSalvar(): void {
    this._dialogRef.close(true);
  }

  public onObterErroComentario(campo: AbstractControl): string | null {
    return campo.hasError('required') ? 'enviarResposta.comentario-obrigatorio' : null;
  }

}
