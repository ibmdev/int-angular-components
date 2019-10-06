import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule} from '@angular/common';
import { MontantComponent } from './montant.component';
import { MontantPipe } from '../lib/pipe/montant.pipe';

@NgModule({
  declarations: [MontantComponent, MontantPipe],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [MontantComponent, MontantPipe],
  providers: [MontantPipe]
})
export class MontantModule { }
