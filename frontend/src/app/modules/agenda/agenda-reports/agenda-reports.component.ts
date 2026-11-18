import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, startWith, switchMap, Subscription } from 'rxjs';
import { COMMONS_MODULES } from '../../../shared';
import { ChangeDetectionStrategy } from '@angular/core';


@Component({

  imports: [COMMONS_MODULES],
  templateUrl: './agenda-reports.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgendaReportsComponent {
  private readonly http = inject(HttpClient);
  private pollingSubscription?: Subscription;

  solicitandoRelatorio = false;
  mensagemRelatorio = '';
  erroRelatorio = false;


solicitarResumoDsa(): void {
  this.solicitandoRelatorio = true;
  this.mensagemRelatorio = '';
  this.erroRelatorio = false;

  this.http.post<{
    mensagem: string;
    id: string;
  }>(
    'http://localhost:8000/api/relatorios/solicitar-resumo-dsa',
    {}
  ).subscribe({
    next: (resposta) => {
      this.mensagemRelatorio = 'Relatório solicitado. Gerando arquivo...';

      this.acompanharRelatorio(resposta.id);
    },
    error: (erro) => {
      console.error('Erro ao solicitar relatório:', erro);

      this.mensagemRelatorio =
        'Não foi possível solicitar o relatório. Tente novamente.';

      this.erroRelatorio = true;
      this.solicitandoRelatorio = false;
    }
  });
}

private acompanharRelatorio(id: string): void {
  this.pollingSubscription?.unsubscribe();

  this.pollingSubscription = interval(2000)
    .pipe(
      startWith(0),
      switchMap(() =>
        this.http.get<{
          status: string;
          url_download?: string;
        }>(
          `http://localhost:8000/api/relatorios/resumo-dsa/${id}`
        )
      )
    )
    .subscribe({
      next: (resposta) => {

        if (resposta.status === 'concluido' && resposta.url_download) {
          this.pollingSubscription?.unsubscribe();

          this.mensagemRelatorio = 'Relatório pronto! Iniciando download...';

          window.location.href = resposta.url_download;

          this.solicitandoRelatorio = false;
        }

        if (resposta.status === 'erro') {
          this.pollingSubscription?.unsubscribe();

          this.mensagemRelatorio =
            'Ocorreu um erro ao gerar o relatório.';

          this.erroRelatorio = true;
          this.solicitandoRelatorio = false;
        }
      },
      error: (erro) => {
        console.error('Erro ao consultar relatório:', erro);

        this.pollingSubscription?.unsubscribe();

        this.mensagemRelatorio =
          'Não foi possível consultar o processamento do relatório.';

        this.erroRelatorio = true;
        this.solicitandoRelatorio = false;
      }
    });
}
}
