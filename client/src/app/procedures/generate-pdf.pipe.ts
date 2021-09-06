import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'generatePdf'
})
export class GeneratePdfPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
