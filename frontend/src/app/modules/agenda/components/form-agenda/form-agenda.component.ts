
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
  AnimationCallbackEvent
} from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { COMMONS_MODULES } from '../../../../shared';
import { TranslateService, TranslateDirective } from '@ngx-translate/core';

export interface Perfil {
  id: number;
  nome: string;
  tipo: string;
}

@Component({
  selector: 'app-form-agenda',
  imports: [COMMONS_MODULES, ReactiveFormsModule, TranslateDirective],
  templateUrl: './form-agenda.component.html',
})
export class FormAgendaComponent implements OnInit, OnChanges {

  @Input() public perfis: Perfil[] = [];
  @Input() public salvando = false;
  @Input() public mensagem = '';

  @Output() public cadastrar = new EventEmitter<{
    titulo: string;
    descricao: string;
    dataEvento: string;
    perfilId: number;
  }>();

  protected formulario = new FormGroup({
    titulo: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    descricao: new FormControl('', {
      nonNullable: true,
    }),

    dataEvento: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    perfilId: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.min(1)],
    }),
  });

  protected idiomaAtual = 'pt-BR';

  private _idiomasSuportados = ['pt-BR', 'en'];

  constructor(private _translate: TranslateService) {}

  public ngOnInit(): void {
    this._definirIdiomaInicial();
  }

  public ngOnChanges(changes: SimpleChanges): void {

    if (changes['perfis'] && this.perfis.length > 0) {
      const perfilAtual = this.formulario.controls.perfilId.value;

      const perfilExiste = this.perfis.some(
        perfil => perfil.id === perfilAtual
      );

      if (!perfilExiste) {
        this.formulario.controls.perfilId.setValue(this.perfis[0].id);
      }
    }

    if (changes['mensagem'] && this.mensagem === 'Salvo com sucesso!') {
      this._limparFormulario();
    }
  }

  public animateForm(event: AnimationCallbackEvent): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    event.target.animate(
      [
        { opacity: 0 },
        { opacity: 1 },
      ],
      { duration: 350, easing: 'ease-out' },
    );
  }

  public onAlterarIdioma(idioma: string): void {
    if (!this._idiomasSuportados.includes(idioma)) {
      return;
    }

    this.idiomaAtual = idioma;

    this._translate.use(idioma);

    localStorage.setItem('idioma', idioma);
  }

  private _definirIdiomaInicial(): void {
    const idiomaSalvo = localStorage.getItem('idioma');
    const idiomaNavegador = navigator.language.split('-')[0];

    let idioma = 'pt-BR';

    if (idiomaSalvo && this._idiomasSuportados.includes(idiomaSalvo)) {
      idioma = idiomaSalvo;
    } else if (this._idiomasSuportados.includes(idiomaNavegador)) {
      idioma = idiomaNavegador;
    }

    this.idiomaAtual = idioma;
    this._translate.use(idioma);
  }

  public onEnviarFormulario(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const dados = this.formulario.getRawValue();

    this.cadastrar.emit({
      titulo: dados.titulo.trim(),
      descricao: dados.descricao.trim(),
      dataEvento: dados.dataEvento,
      perfilId: dados.perfilId,
    });
  }

  private _limparFormulario(): void {
    this.formulario.reset({
      titulo: '',
      descricao: '',
      dataEvento: '',
      perfilId: this.perfis[0]?.id ?? 0,
    });
  }
}
