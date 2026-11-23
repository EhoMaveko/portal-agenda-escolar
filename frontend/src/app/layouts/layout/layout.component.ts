import { Component } from '@angular/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { COMMONS_MODULES } from '../../shared';

@Component({
  imports: [COMMONS_MODULES, TranslatePipe],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  itemAtivo: number = 1;

  constructor(private _translate: TranslateService) {
    const idiomaSalvo = localStorage.getItem('idioma') || 'pt-BR';
    this._translate.use(idiomaSalvo);
  }

  public onSelecionarItem(item: number): void {
    this.itemAtivo = item;
  }

  public onAlterarIdioma(idioma: string): void {
    this._translate.use(idioma).subscribe({
      next: () => console.log('Idioma alterado:', idioma),
      error: (erro) => console.error('Erro ao alterar idioma:', erro),
    });

    localStorage.setItem('idioma', idioma);
  }
}
