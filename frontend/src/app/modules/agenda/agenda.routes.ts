import { Routes } from '@angular/router';
import { AgendaListComponent } from './agenda-list/agenda-list.component';
import { AgendaCreateComponent } from './agenda-create/agenda-create.component';

export const routes: Routes = [
  {
    path: '',
    component: AgendaListComponent,
  },
  {
    path: 'create',
    component: AgendaCreateComponent,
  },
  {
    path: 'edit/:id',
    component: AgendaCreateComponent,
  }
];
