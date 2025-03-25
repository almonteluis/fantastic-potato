// src/app/components/sortable-table/sortable-table.component.ts
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableService } from '../../services/table.service';
import { City } from '../../data/worldcities/cities.service';
import { TableHeaderComponent } from './table-header/table-header.component';
import { TableRowComponent } from './table-row/table-row.component';
import { TableFooterComponent } from './table-footer/table-footer.component';

@Component({
  selector: 'app-sortable-table',
  standalone: true,
  imports: [
    CommonModule,
    TableHeaderComponent,
    TableRowComponent,
    TableFooterComponent,
  ],
  template: `
    <div class="relative rounded-border">
      <!-- Table wrapper with forced overflow behavior -->
      <div class="overflow-x-auto -webkit-overflow-scrolling-touch">
        <table
          class="min-w-full w-max divide-y divide-gray-200 table-fixed text-sm text-left text-gray-500 dark:text-gray-400"
        >
          <app-table-header></app-table-header>
          <!-- Loading skeleton -->
          <tbody
            class="w-full bg-white divide-y divide-gray-200"
            *ngIf="isLoading"
          >
            <tr *ngFor="let _ of [1, 2, 3, 4, 5]">
              <td *ngFor="let _ of [1, 2, 3, 4, 5, 6, 7]" class="px-6 py-4">
                <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
              </td>
            </tr>
          </tbody>
          <!-- Table data -->
          <app-table-row *ngIf="!isLoading"></app-table-row>
        </table>
      </div>

      <!-- Footer positioned outside scrollable area -->
      <div class=" border-t">
        <app-table-footer></app-table-footer>
      </div>
    </div>
  `,
  styles: [
    `
      .relative {
        position: relative;
      }

      :host {
        border-radius: 15px;
      }

      .overflow-x-auto {
        overflow-x: auto;
      }

      .min-w-full {
        min-width: 100%;
      }

      .w-max {
        width: max-content;
      }

      .mt-4 {
        margin-top: 1rem;
      }

      .border-t {
        border-top-width: 1px;
      }

      .py-4 {
        padding-top: 1rem;
        padding-bottom: 1rem;
      }
    `,
  ],
})
export class SortableTableComponent implements OnInit, OnChanges {
  @Input() cities: City[] = [];
  @Input() isLoading = true;

  constructor(private tableService: TableService) {}

  ngOnInit(): void {
    if (this.cities.length > 0 && !this.isLoading) {
      this.tableService.setCities(this.cities);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cities'] && !this.isLoading) {
      this.tableService.setCities(this.cities);
    }
  }
}
