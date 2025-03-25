// src/app/components/city-list/city-list.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { City } from '../../data/worldcities/cities.service';
import { SortableTableComponent } from '../sortable-table/sortable-table.component';

@Component({
  selector: 'app-city-list',
  standalone: true,
  imports: [CommonModule, SortableTableComponent],
  template: `
    <!-- Just forward props to the SortableTable component -->
    <app-sortable-table
      [cities]="cities"
      [isLoading]="isLoading"
    ></app-sortable-table>
  `,
  styles: [],
})
export class CityListComponent {
  @Input() cities: City[] = [];
  @Input() isLoading = false;
}
