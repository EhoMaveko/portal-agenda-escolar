import { Component } from '@angular/core';
import { COMMONS_MODULES } from './shared';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [COMMONS_MODULES],
  templateUrl: './app.html'
})
export class App {}
