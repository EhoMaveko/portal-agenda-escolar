import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { COMMONS_MODULES } from '../../shared';

@Component({
  imports: [COMMONS_MODULES],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  itemAtivo: number = 1;

  constructor(private _translate: TranslateService) {
    const idiomaSalvo = localStorage.getItem('idioma') || 'pt-BR';

    this.itemAtivo = idiomaSalvo === 'pt-BR' ? 1 : 2;

    this._translate.use(idiomaSalvo);
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
