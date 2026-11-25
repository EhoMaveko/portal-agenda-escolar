import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule, RouterOutlet } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { TranslatePipe } from "@ngx-translate/core";



export const COMMONS_MODULES = [
  CommonModule,
  RouterOutlet,
  RouterModule,
  FormsModule,
  AngularSvgIconModule,
  TranslatePipe
];
