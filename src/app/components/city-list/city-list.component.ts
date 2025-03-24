// city-list.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { City } from '../../data/worldcities/cities.service';

type SortDirection = 'asc' | 'desc';

interface SortConfig {
  column: keyof City;
  direction: SortDirection;
}

@Component({
  selector: 'app-city-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.css'],
})
export class CityListComponent implements OnInit {
  @Input() cities: City[] = [];
  @Input() isLoading = false;

  displayedCities: City[] = [];
  sortConfig: SortConfig = {
    column: 'name',
    direction: 'asc',
  };

  constructor() {}

  ngOnInit(): void {
    this.sortCities();
  }

  ngOnChanges(): void {
    this.sortCities();
  }

  sortCities(): void {
    if (!this.cities) return;

    this.displayedCities = [...this.cities].sort((a, b) => {
      const valueA = a[this.sortConfig.column];
      const valueB = b[this.sortConfig.column];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortConfig.direction === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (this.sortConfig.direction === 'asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });
  }

  handleSort(column: keyof City): void {
    if (this.sortConfig.column === column) {
      // Toggle direction if same column
      this.sortConfig.direction =
        this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
      // Set new column with asc direction
      this.sortConfig = {
        column,
        direction: 'asc',
      };
    }
    this.sortCities();
  }

  getSortIndicator(column: keyof City): string {
    if (this.sortConfig.column !== column) return '';
    return this.sortConfig.direction === 'asc' ? '↑' : '↓';
  }
}
