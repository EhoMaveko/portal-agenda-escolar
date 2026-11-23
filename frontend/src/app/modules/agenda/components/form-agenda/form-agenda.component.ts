
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  AnimationCallbackEvent
} from '@angular/core';

import { COMMONS_MODULES } from '../../../../shared';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

export interface Perfil {
  id: number;
  nome: string;
  tipo: string;
}

@Component({
  selector: 'app-form-agenda',
  imports: [COMMONS_MODULES, TranslatePipe],
  templateUrl: './form-agenda.component.html',
})
export class FormAgendaComponent implements OnInit {
  @Input() public perfis: Perfil[] = [];
  @Input() public salvando = false;
  @Input() public mensagem = '';

  @Output() public cadastrar = new EventEmitter<{
    titulo: string;
    descricao: string;
    dataEvento: string;
    perfilId: number;
  }>();

  public animateForm(event: AnimationCallbackEvent): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    event.target.animate(
      [
        { opacity: 0, },
        { opacity: 1, },
      ],
      { duration: 350, easing: 'ease-out' },
    );
  }

  protected titulo = '';
  protected descricao = '';
  protected dataEvento = '';
  protected perfilId = 0;

  protected idiomaAtual = 'pt-BR';

  private _idiomasSuportados = ['pt-BR', 'en'];

  constructor(private _translate: TranslateService) {}

  public ngOnInit(): void {
    this._definirIdiomaInicial();

    if (this.perfis.length > 0 && !this.perfis.some(p => p.id === this.perfilId)) {
      this.perfilId = this.perfis[0].id;
    }

    if (this.mensagem === 'Salvo com sucesso!') {
      this._limparFormulario();
    }
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

  private _limparFormulario(): void {
    this.titulo = '';
    this.descricao = '';
    this.dataEvento = '';
  }
}
