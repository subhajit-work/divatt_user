import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'base64'
})
export class Base64Pipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let a = '';
    if(value){
       a = atob(value);
    }
    return a;
  }

}
