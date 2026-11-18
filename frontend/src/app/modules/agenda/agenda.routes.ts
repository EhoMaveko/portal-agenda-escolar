import { Routes } from '@angular/router';
import { AgendaListComponent } from './agenda-list/agenda-list.component';
import { AgendaCreateComponent } from './agenda-create/agenda-create.component';
import { AgendaReportsComponent } from './agenda-reports/agenda-reports.component';
import { AgendaWelcomeComponent } from './agenda-welcome/agenda-welcome.component';

export const routes: Routes = [

  {
    path: '',
    component: AgendaWelcomeComponent,
  },

  {
    path: 'create',
    component: AgendaCreateComponent,
  },
  {
    path: 'list',
    component: AgendaListComponent,
  },
  {
    path: 'reports',
    component: AgendaReportsComponent,
  }
];
