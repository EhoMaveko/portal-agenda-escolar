import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({

  templateUrl: './agenda-welcome.component.html',


})
export class AgendaWelcomeComponent implements OnInit, OnDestroy {
  protected isLeaving = false;

  private readonly router = inject(Router);
  private timeout: ReturnType<typeof setTimeout> | undefined;

  public ngOnInit(): void {
    this.timeout = setTimeout(() => {
      this.isLeaving = true;

      setTimeout(() => {
        this.router.navigate(['/create']);
      }, 600);

    }, 2000);
  }

  public ngOnDestroy(): void {
    clearTimeout(this.timeout);
  }
}
