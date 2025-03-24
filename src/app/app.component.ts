// app.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavComponent } from './components/nav/nav.component';
import { CityListComponent } from './components/city-list/city-list.component';
import { CitiesService, City } from './data/worldcities/cities.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, NavComponent, CityListComponent],
  template: `
    <main class="main">
      <div class="content">
        <div class="left-side">
          <app-nav></app-nav>
          <h1 class="text-text-primary text-center dark:text-text-primary-dark">City List</h1>
          
          <form class="flex justify-center py-3" (ngSubmit)="handleFormSubmit($event)">
            <div class="relative max-w-md mx-auto">
              <input
                id="search"
                name="search"
                type="text"
                [(ngModel)]="searchTerm"
                placeholder="Search for a city"
                class="w-full rounded-lg text-md border border-gray-300 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 pl-8"
              />
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  width="16"
                  height="16"
                  fill="currentColor"
                >
                  <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
                </svg>
              </span>
            </div>
          </form>

          <div *ngIf="error" class="text-text-primary dark:text-text-primary-dark">Eek! {{ error.message }}</div>
          
          <app-city-list *ngIf="!error" [cities]="cities" [isLoading]="isDataLoading"></app-city-list>
        </div>
      </div>
    </main>
    <router-outlet />
  `,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'City Search';
  searchTerm = '';
  cities: City[] = [];
  error: Error | null = null;
  isDataLoading = true;

  constructor(private citiesService: CitiesService) {}

  ngOnInit(): void {
    // Remove initial loader if it exists
    const loader = document.getElementById("initial-loader");
    if (loader) {
      loader.remove();
    }

    this.loadInitialData();
  }

  async loadInitialData(): Promise<void> {
    try {
      const cached = this.getCachedCities();
      if (cached) {
        this.cities = cached;
        this.isDataLoading = false;
        return;
      }

      await this.runSearch('');
    } finally {
      this.isDataLoading = false;
    }
  }

  async runSearch(term: string): Promise<void> {
    this.error = null;
    try {
      this.isDataLoading = true;
      if (!term) {
        const cached = this.getCachedCities();
        if (cached) {
          this.cities = cached;
          this.isDataLoading = false;
          return;
        }
      }

      this.citiesService.getCities({ searchTerm: term }).subscribe({
        next: (result) => {
          this.cities = result;
          if (!term) {
            this.setCachedCities(result);
          }
          this.isDataLoading = false;
        },
        error: (err) => {
          if (err instanceof Error) {
            this.error = err;
          } else {
            this.error = new Error("An unexpected error occurred");
          }
          this.isDataLoading = false;
        }
      });
    } catch (err) {
      if (err instanceof Error) {
        this.error = err;
      } else {
        this.error = new Error("An unexpected error occurred");
      }
      this.isDataLoading = false;
    }
  }

  onSearchTermChange(): void {
    this.runSearch(this.searchTerm);
  }

  handleFormSubmit(e: Event): void {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const inputElement = formData.get("search") as string;
    this.searchTerm = inputElement;
    this.runSearch(this.searchTerm);
  }

  // Simple caching methods
  getCachedCities(): City[] | null {
    const cachedData = localStorage.getItem('cachedCities');
    if (cachedData) {
      try {
        return JSON.parse(cachedData);
      } catch (e) {
        localStorage.removeItem('cachedCities');
      }
    }
    return null;
  }

  setCachedCities(cities: City[]): void {
    localStorage.setItem('cachedCities', JSON.stringify(cities));
  }
}