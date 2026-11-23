import { Component, DestroyRef, EventEmitter, Input, Output, inject } from '@angular/core';
import { COMMONS_MODULES } from '../../../../shared';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';



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
  protected formatoData = 'dd/MM';

  @Input() public agendas: Agenda[] = [];
  @Input() public carregando = false;
  @Input() public erro = '';

  @Output() public selecionar = new EventEmitter<number>();
  @Output() public excluir = new EventEmitter<Agenda>();

  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.atualizarFormatoData();
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.atualizarFormatoData());
  }

  private atualizarFormatoData(): void {
    this.formatoData = this.translate.currentLang() === 'en' ? 'MM/dd' : 'dd/MM';
  }

}


