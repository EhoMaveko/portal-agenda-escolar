import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './agenda-welcome.component.html',
})
export class AgendaWelcomeComponent implements OnInit, OnDestroy {
  private router = inject(Router);

  isLeaving = false;
  private timeout: ReturnType<typeof setTimeout> | undefined;

  ngOnInit(): void {
    this.timeout = setTimeout(() => {
      this.isLeaving = true;

      setTimeout(() => {
        this.router.navigate(['/create']);
      }, 600);

    }, 2000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeout);
  }
}
