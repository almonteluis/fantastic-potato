// src/app/components/sortable-table/table-footer/table-footer.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableService } from '../../../services/table.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-table-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table-footer.component.html',
  styles: [
    /* ... styles remain the same ... */
  ],
})
export class TableFooterComponent implements OnInit {
  page$: Observable<number>;
  range$: Observable<number[]>;
  slice$: Observable<any[]>;
  rowsPerPage$: Observable<number>;
  totalPages$: Observable<number>;

  constructor(private tableService: TableService) {
    this.page$ = this.tableService.page$;
    this.range$ = this.tableService.range$;
    this.slice$ = this.tableService.slice$;
    this.rowsPerPage$ = this.tableService.rowsPerPage$;

    // Derived observable for total pages (length of range array)
    this.totalPages$ = this.range$.pipe(map((range) => range.length));
  }

  ngOnInit(): void {}

  handleRowsPerPageChange(value: string): void {
    this.tableService.setRowsPerPage(parseInt(value, 10));
  }

  goToFirstPage(): void {
    this.tableService.goToFirstPage();
  }

  goToPreviousPage(): void {
    this.tableService.goToPreviousPage();
  }

  goToNextPage(): void {
    this.tableService.goToNextPage();
  }

  goToLastPage(): void {
    this.tableService.goToLastPage();
  }
}
