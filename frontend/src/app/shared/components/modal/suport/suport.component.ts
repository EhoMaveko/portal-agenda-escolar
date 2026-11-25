import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { COMMONS_MODULES } from '../../../../shared';

@Component({
  selector: 'app-suport',
  standalone: true,
  imports: [...COMMONS_MODULES, RouterLink],
  templateUrl: './suport.component.html',
})
export class SuportComponent {
  @Output() fechar = new EventEmitter<void>();

  constructor(public router: Router) {}

  @HostListener('document:keydown.escape')
  onFecharComEscape(): void {
    this.fechar.emit();
  }
}
