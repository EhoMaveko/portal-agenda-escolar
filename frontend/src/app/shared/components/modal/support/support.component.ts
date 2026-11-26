import { Component } from '@angular/core';
import { DialogRef, Dialog } from '@angular/cdk/dialog';
import { COMMONS_MODULES } from '../../..';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [COMMONS_MODULES, RouterModule],
  templateUrl: './support.component.html',
})
export class SupportComponent {

  constructor(
    public router: Router,
    private _dialogRef: DialogRef,
    private _dialog: Dialog,
  ){}

  public onFechar(): void {
    this._dialogRef.close();
  }

  public onSalvar(): void {
    this._dialogRef.close(true);
  }

}
