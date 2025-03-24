// src/app/components/city-list/city-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { CitiesService, City } from '../../data/worldcities/cities.service';

@Component({
  selector: 'app-city-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.css'],
})
export class CityListComponent implements OnInit {
  cities: City[] = [];
  isLoading = false;
  error: string | null = null;
  searchControl = new FormControl('');

  constructor(private citiesService: CitiesService) {}

  ngOnInit(): void {
    // Initial data load
    this.loadCities();

    // Setup search with debounce
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          this.isLoading = true;
          return this.citiesService.getCities({
            searchTerm: term || '',
            limit: 20, // Limit results
          });
        })
      )
      .subscribe({
        next: (results) => {
          this.cities = results;
          this.isLoading = false;
          this.error = null;
        },
        error: (err) => {
          this.error = err.message;
          this.isLoading = false;
          this.cities = [];
        },
      });
  }

  loadCities(): void {
    this.isLoading = true;
    this.citiesService.getCities({ limit: 20 }).subscribe({
      next: (cities) => {
        this.cities = cities;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
      },
    });
  }
}
