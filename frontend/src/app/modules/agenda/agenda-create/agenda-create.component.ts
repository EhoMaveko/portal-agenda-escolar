
import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { COMMONS_MODULES } from '../../../shared';
import {
  FormAgendaComponent,
  Perfil,
} from '../components/form-agenda/form-agenda.component';


@Component({
  imports: [COMMONS_MODULES, FormAgendaComponent],
  templateUrl: './agenda-create.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgendaCreateComponent implements OnInit {

  protected perfis: Perfil[] = [];
  protected salvando = false;
  protected mensagem = '';

  private _http: HttpClient;
  private _cdr: ChangeDetectorRef;
  private _translate: TranslateService;

  constructor(http: HttpClient, cdr: ChangeDetectorRef, translate: TranslateService) {
    this._http = http;
    this._cdr = cdr;
    this._translate = translate;
  }

  public ngOnInit(): void {
    this.onCarregarPerfis();
  }

  private onCarregarPerfis(): void {
    this._http.get<Perfil[]>('http://localhost:8000/api/perfis')
      .subscribe({
        next: (dados) => {
          this.perfis = dados;
          this._cdr.markForCheck();
        },
        error: (erro) => {
          console.error('Erro ao buscar perfis:', erro);
          this.mensagem = 'Não foi possível carregar os perfis.';
          this._cdr.markForCheck();
        },
      });
  }

  public onCadastrarAgenda(dados: {
    titulo: string;
    descricao: string;
    dataEvento: string;
    perfilId: number;
  }): void {
    this.salvando = true;
    this.mensagem = '';

    const novaAgenda = {
      perfil_id: dados.perfilId,
      titulo: dados.titulo,
      descricao: dados.descricao,
      data_evento: dados.dataEvento,
      status: 'ativo',
    };

    this._http.post(
      'http://localhost:8000/api/agendas',
      novaAgenda
    ).subscribe({
      next: () => {
        this.mensagem = this._translate.instant('criarAgenda.agenda-sucess');
        this.salvando = false;
        this._cdr.markForCheck();
      },
      error: (erro) => {
        console.error('Erro ao cadastrar agenda:', erro);
        this.mensagem = this._translate.instant('criarAgenda.agenda-failed');
        this.salvando = false;
        this._cdr.markForCheck();
      },
    });
  }
}
