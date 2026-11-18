import { Component, OnInit } from '@angular/core';
import { COMMONS_MODULES } from '../../../shared';
import { FormAgendaComponent } from '../components/form-agenda/form-agenda.component';

@Component({
  selector: 'app-agenda-create',
  imports: [COMMONS_MODULES, FormAgendaComponent],
  templateUrl: './agenda-create.component.html'
})
export class AgendaCreateComponent implements OnInit {
  entered = false;

  ngOnInit(): void {
    requestAnimationFrame(() => {
      this.entered = true;
    });
  }
}

