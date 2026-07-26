import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  // Generic filter - filters an array of objects by a given field and search term
  transform(items: any[], searchTerm: string, field: string): any[] {

    if (!items) return [];
    if (!searchTerm || !field) return items;

    searchTerm = searchTerm.toLowerCase();

    return items.filter(item =>
      (item[field] ?? '').toString().toLowerCase().includes(searchTerm)
    );
  }

}