import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
const padding = '000000';

@Pipe({
  name: 'montant'
})
export class MontantPipe implements PipeTransform {
  private prefix: string;
  private decimalSeparator: string;
  private thousandsSeparator: string;
  private suffix: string;

  constructor() {
    this.prefix = '';
    this.suffix = '';
    this.decimalSeparator = '.';
    this.thousandsSeparator = ' ';
  }

  transform(fc: FormControl, value: string, fractionSize: number = 0 ): string {

    if (value === undefined || value === null) {
      value = '';
    }
    const initValue = value;
    value = value.replace(/\,/g, '.');
    if (parseFloat(value) % 1 !== 0)
    {
      fractionSize = 2;
    }
    let [ integer, fraction = ''] = (parseFloat(value).toString() || '').toString().split('.');

    fraction = fractionSize > 0
      ? this.decimalSeparator + (fraction + padding).substring(0, fractionSize) : '';
    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandsSeparator);
    if(isNaN(parseFloat(integer)))
    {
          if (initValue === '') {
            integer = '';
          } else {
            fc.setErrors({format: true});
            fc.markAsTouched();
            return initValue;
          }
    }
    let montant: any = this.prefix + integer + fraction + this.suffix;
    montant = montant.replace(/\./g, ',');
    return integer !== '' ? montant : '';
  }

  parse(value: string, fractionSize: number = 2): string {

    value = value.replace(/\./g, ',');

    let [ integer, fraction = '' ] = (value || '').replace(this.prefix, '')
                                                  .replace(this.suffix, '')
                                                  .split(this.decimalSeparator);

    integer = integer.replace(new RegExp(this.thousandsSeparator, 'g'), '');

    fraction = parseInt(fraction, 10) > 0 && fractionSize > 0
      ? this.decimalSeparator + (fraction + padding).substring(0, fractionSize)
      : '';
    let montant =   integer + fraction;
    montant = montant.replace(/\,/g,'.');
    return montant;
  }
}
