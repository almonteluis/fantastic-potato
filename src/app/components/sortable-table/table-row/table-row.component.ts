// src/app/components/sortable-table/table-row/table-row.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableService } from '../../../services/table.service';
import { City } from '../../../data/worldcities/cities.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-table-row',
  standalone: true,
  imports: [CommonModule],
  template: `
    <tbody class="bg-[#f8f5f2] w-full">
      <tr
        *ngFor="let city of slice$ | async"
        class="bg-[#f8f5f2] border-b hover:bg-[#005961]/10"
      >
        <td
          *ngFor="let header of tableHeaders$ | async"
          class="px-6 py-4 text-text-primary dark:text-text-primary-dark whitespace-nowrap border-b"
        >
          {{ String(city[header]) }}
        </td>
      </tr>
    </tbody>
  `,
  styles: [
    `
      :host {
        display: table;
        width: 100%;
      }
    `,
  ],
})
export class TableRowComponent implements OnInit {
  slice$: Observable<City[]>;
  tableHeaders$: Observable<Array<keyof City>>;

  // Helper method to convert values to strings
  String = String;

  constructor(private tableService: TableService) {
    this.slice$ = this.tableService.slice$;
    this.tableHeaders$ = this.tableService.tableHeaders$;
  }

  ngOnInit(): void {}
}
