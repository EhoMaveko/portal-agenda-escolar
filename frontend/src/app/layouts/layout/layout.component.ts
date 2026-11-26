import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { COMMONS_MODULES } from '../../shared';
import { Router, RouterLink } from '@angular/router';
import { SupportComponent } from '../../shared/components/modal/support/support.component';
import { PerfilComponent } from '../popover/perfil/perfil.component';

@Component({
  imports: [COMMONS_MODULES, RouterLink, SupportComponent, PerfilComponent],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  itemAtivo: number = 1;
  suporteVisivel = false;

  constructor(private _translate: TranslateService, public router: Router, private _dialog:Dialog) {
    const idiomaSalvo = localStorage.getItem('idioma') || 'pt-BR';

    this.itemAtivo = idiomaSalvo === 'pt-BR' ? 1 : 2;

    this._translate.use(idiomaSalvo);
  }

  public  onAbrirModal(): void {
    this._dialog.open(SupportComponent, {
      width: '450px',
      maxWidth: '90vw',
      disableClose: false,
      hasBackdrop: true,
      backdropClass: 'bg-black/40',
    });

  }
  public onSelecionarIdioma(item: number, idioma: string): void {
    this.itemAtivo = item;

    this._translate.use(idioma).subscribe({
      next: () => console.log('Idioma alterado:', idioma),
      error: (erro) => console.error('Erro ao alterar idioma:', erro),
    });

    localStorage.setItem('idioma', idioma);
  }
}
