import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'TimeStamp',
  pure: false,
})
export class TimeStampPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(content: any) {
    if (content) {
      return new Date(content * 1000);
    } else {
      return 'Never';
    }
  }
}
