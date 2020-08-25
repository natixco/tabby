import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(private _DomSanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    console.log(this._DomSanitizer.bypassSecurityTrustHtml(value))
    return this._DomSanitizer.bypassSecurityTrustHtml(value)
  }

}
