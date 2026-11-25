import { Component } from '@angular/core';
import { COMMONS_MODULES } from '../../../shared';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [COMMONS_MODULES],
  templateUrl: './perfil.component.html',
})
export class PerfilComponent {
  perfilAberto = false;
  abaAtiva = 'perfil';

  onAlternarPerfil(): void {
    this.perfilAberto = !this.perfilAberto;
  }

  onSelecionarAba(aba: string): void {
    this.abaAtiva = aba;
  }

  onFecharPerfil(): void {
    this.perfilAberto = false;
  }
}
