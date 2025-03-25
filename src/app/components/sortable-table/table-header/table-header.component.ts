// src/app/components/sortable-table/table-header/table-header.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableService } from '../../../services/table.service';
import { City } from '../../../data/worldcities/cities.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-table-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-header.component.html',
  styleUrl: './table-header.component.css',
})
export class TableHeaderComponent implements OnInit {
  tableHeaders$: Observable<Array<keyof City>>;
  sortConfig$: Observable<any>;

  constructor(private tableService: TableService) {
    this.tableHeaders$ = this.tableService.tableHeaders$;
    this.sortConfig$ = this.tableService.sortConfig$;
  }

  ngOnInit(): void {}

  handleSort(column: keyof City): void {
    this.tableService.handleSort(column);
  }

  getSortIcon(column: keyof City): string | null {
    if (this.tableService.sortConfig.column === column) {
      return this.tableService.sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return null;
  }
}
