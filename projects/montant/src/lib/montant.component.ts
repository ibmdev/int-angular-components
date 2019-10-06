import { Component, Input, forwardRef, AfterViewInit,
  OnChanges, ViewEncapsulation, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, Validators } from '@angular/forms';
import {MontantPipe} from '../lib/pipe/montant.pipe';


export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
   provide: NG_VALUE_ACCESSOR,
   // tslint:disable-next-line: no-use-before-declare
   useExisting: forwardRef(() => MontantComponent),
   multi: true
};

@Component({
selector: 'ui-montant-common-component',
 templateUrl: './montant.component.html',
 styleUrls: ['./montant.component.scss'],
   encapsulation: ViewEncapsulation.None,
 providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})

export class MontantComponent implements ControlValueAccessor, AfterViewInit, OnChanges, OnInit {

   // tslint:disable-next-line:no-input-rename
   @Input('fc') fc: FormControl;
   // tslint:disable-next-line:no-input-rename
   @Input('idComponent') idComponent: string;
   // tslint:disable-next-line:no-input-rename
   @Input('classComponent') classComponent: string;
   // tslint:disable-next-line:no-input-rename
   @Input('minCurrency') minCurrency: number;
   // tslint:disable-next-line:no-input-rename
   @Input('maxCurrency') maxCurrency: number;
   // tslint:disable-next-line:no-input-rename
   @Input('classMessageError') classMessageError: string;
   // tslint:disable-next-line:no-input-rename
   @Input('mandatory') mandatory: boolean;
   // tslint:disable-next-line:no-input-rename
   @Input('symbol') symbol: string;
   // tslint:disable-next-line:no-input-rename
   @Input('messages') messages: any;
   // tslint:disable-next-line:no-input-rename
   @Input('type') type: string;

   @ViewChild('input')  inputRef: ElementRef;
   // tslint:disable-next-line:no-input-rename
   @Input('innerValue') innerValues = 0;
   get innerValue() {
       return this.innerValues;
   }
   set innerValue(val) {
       this.innerValues = val;
       this.propagateChange(val);
   }

   // Messages erreur sur les limites du montant
   messageErreurFormat = 'Le montant doit être composé uniquement de chiffres';
   messageErreurMontantMin = 'Le montant doit être positif  et supérieur à {montant}';
   messageErreurMontantMax =  'Le montant doit être positif et inférieur à {montant}';
   messageErreurMandatory =  'Le montant est obligatoire';
   regMontant = /{montant}/gi;

   constructor(private formatcurrencypipe: MontantPipe) {}

   ngOnInit() {

       if (this.messages && this.messages.messageErreurFormat) {
           this.messageErreurFormat = this.messages.messageErreurFormat;
       }
       if (this.messages && this.messages.messageErreurMandatory) {
           this.messageErreurMandatory = this.messages.messageErreurMandatory;
       }

       if (this.messages && this.messages.messageErreurMontantMin) {
           this.messageErreurMontantMin = this.messages.messageErreurMontantMin;
       }

       if (this.messages && this.messages.messageErreurMontantMax) {
           this.messageErreurMontantMax = this.messages.messageErreurMontantMax;
       }

       if (this.minCurrency && this.minCurrency > 0) {
           this.messageErreurMontantMin = this.messageErreurMontantMin.replace(this.regMontant,this.formatcurrencypipe
             .transform(this.fc, '' + this.minCurrency));
       }
       if (this.maxCurrency && this.maxCurrency > 0) {
         this.messageErreurMontantMax = this.messageErreurMontantMax.replace(this.regMontant, this.formatcurrencypipe
           .transform(this.fc, '' + this.maxCurrency));
       }
       this.inputRef.nativeElement.value = this.formatcurrencypipe.transform(this.fc, this.fc.value);
   }

  ngOnChanges() {}

   ngAfterViewInit() {

     this.fc.valueChanges.subscribe(
           (value: string) => {}
     );
   }
   onBlur(e) {
        this.fc.setValue(e.target.value);
        this.inputRef.nativeElement.value = this.formatcurrencypipe.transform(this.fc, e.target.value);
        if (!this.fc.hasError('format')) {
           const valeur = this.formatcurrencypipe.parse(e.target.value);
           this.fc.setValue(valeur);
           if (this.type && this.type === 'number') {
               this.fc.setValue(+valeur);
           }
       }
        if (this.mandatory && this.mandatory === true && this.fc.value === '' ) {
           this.fc.setErrors({mandatory: true});
           this.fc.markAsTouched();
       } else if (this.minCurrency && this.fc.value !== '' && this.fc.value < this.minCurrency) {
           this.fc.setErrors({montantMin: true});
           this.fc.markAsTouched();
       } else if (this.maxCurrency && this.fc.value > this.maxCurrency ) {
           this.fc.setErrors({montantMax: true});
           this.fc.markAsTouched();
       }
   }
   onClick(e) {
       const oldValue = this.fc.value;
       this.inputRef.nativeElement.value = this.formatcurrencypipe.parse(e.target.value);
       if (oldValue !== this.inputRef.nativeElement.value) {
           this.fc.setValue(this.inputRef.nativeElement.value);
       }
   }

   // Propagation des changements au form control
   propagateChange: any = () => {};
   writeValue(value: any) {
      if (value) {
       this.innerValues = value;
     }
   }
   registerOnChange(fn) {
     this.propagateChange = fn;
   }
   registerOnTouched() {}
}



