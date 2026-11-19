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
  protected solicitandoRelatorio = false;
  protected mensagemRelatorio = '';
  protected erroRelatorio = false;

  private readonly http = inject(HttpClient);
  private pollingSubscription?: Subscription;


public onSolicitarResumoDsa(): void {
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
        }>(
          `http://localhost:8000/api/relatorios/resumo-dsa/${id}`
        )
      )
    )
    .subscribe({
      next: (resposta) => {

        if (resposta.status === 'concluido') {
          this.pollingSubscription?.unsubscribe();
          this.baixarRelatorio(id);
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

private baixarRelatorio(id: string): void {
  this.http.get(
    `http://localhost:8000/api/relatorios/resumo-dsa/${id}/download`,
    { responseType: 'blob' }
  ).subscribe({
    next: (arquivo) => {
      const url = URL.createObjectURL(arquivo);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'resumo-dsa.txt';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 0);

      this.mensagemRelatorio = 'Relatório baixado com sucesso.';
      this.solicitandoRelatorio = false;
    },
    error: (erro) => {
      console.error('Erro ao baixar relatório:', erro);
      this.mensagemRelatorio = 'Não foi possível baixar o relatório.';
      this.erroRelatorio = true;
      this.solicitandoRelatorio = false;
    }
  });
}
}
