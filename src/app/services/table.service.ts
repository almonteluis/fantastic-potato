// src/app/services/table.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { City } from '../data/worldcities/cities.service';

export interface SortConfig {
  column?: keyof City;
  direction: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root',
})
export class TableService {
  // Core data
  private citiesSubject = new BehaviorSubject<City[]>([]);
  public cities$ = this.citiesSubject.asObservable();

  // Sorting state
  private sortConfigSubject = new BehaviorSubject<SortConfig>({
    direction: 'asc',
  });
  public sortConfig$ = this.sortConfigSubject.asObservable();

  // Pagination state
  private pageSubject = new BehaviorSubject<number>(1);
  public page$ = this.pageSubject.asObservable();

  private rowsPerPageSubject = new BehaviorSubject<number>(10);
  public rowsPerPage$ = this.rowsPerPageSubject.asObservable();

  // Derived data
  private sliceSubject = new BehaviorSubject<City[]>([]);
  public slice$ = this.sliceSubject.asObservable();

  private rangeSubject = new BehaviorSubject<number[]>([]);
  public range$ = this.rangeSubject.asObservable();

  private tableHeadersSubject = new BehaviorSubject<Array<keyof City>>([]);
  public tableHeaders$ = this.tableHeadersSubject.asObservable();

  constructor() {}

  // Initialize service with data
  setCities(cities: City[]): void {
    this.citiesSubject.next(cities);

    // Set table headers if cities are available
    if (cities.length > 0) {
      this.tableHeadersSubject.next(
        Object.keys(cities[0]) as Array<keyof City>
      );
    } else {
      this.tableHeadersSubject.next([]);
    }

    // Update pagination
    this.calculatePagination();
  }

  // Handle sorting
  handleSort(column: keyof City): void {
    const currentConfig = this.sortConfigSubject.value;
    const direction =
      currentConfig.column === column && currentConfig.direction === 'asc'
        ? 'desc'
        : 'asc';

    const currentCities = [...this.citiesSubject.value];
    const sortedData = currentCities.sort((a: City, b: City) => {
      const aValue = a[column];
      const bValue = b[column];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

    this.citiesSubject.next(sortedData);
    this.sortConfigSubject.next({ column, direction });
    this.calculatePagination();
  }

  // Pagination methods
  setPage(newPage: number): void {
    const totalPages = this.rangeSubject.value.length;

    if (newPage < 1) {
      newPage = 1;
    } else if (totalPages > 0 && newPage > totalPages) {
      newPage = totalPages;
    }

    this.pageSubject.next(newPage);
    this.calculatePagination();
  }

  setRowsPerPage(newRowsPerPage: number): void {
    this.rowsPerPageSubject.next(newRowsPerPage);
    this.pageSubject.next(1); // Reset to first page
    this.calculatePagination();
  }

  goToFirstPage(): void {
    this.setPage(1);
  }

  goToPreviousPage(): void {
    this.setPage(this.pageSubject.value - 1);
  }

  goToNextPage(): void {
    this.setPage(this.pageSubject.value + 1);
  }

  goToLastPage(): void {
    this.setPage(this.rangeSubject.value.length);
  }

  // Calculate pagination data
  private calculatePagination(): void {
    const cities = this.citiesSubject.value;
    const page = this.pageSubject.value;
    const rowsPerPage = this.rowsPerPageSubject.value;

    // Calculate total pages
    const totalPages = Math.ceil(cities.length / rowsPerPage);
    const range = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Get current page data
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const slice = cities.slice(start, end);

    // Handle edge case: empty page
    if (slice.length === 0 && page > 1) {
      this.pageSubject.next(page - 1);
      this.calculatePagination();
      return;
    }

    this.sliceSubject.next(slice);
    this.rangeSubject.next(range);
  }

  // Utility methods
  get sortConfig(): SortConfig {
    return this.sortConfigSubject.value;
  }

  get page(): number {
    return this.pageSubject.value;
  }

  get totalPages(): number {
    return this.rangeSubject.value.length;
  }
}
