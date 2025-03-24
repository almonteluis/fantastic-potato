import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { cities, CityRaw } from './../cities';

export type SearchOptions = Partial<{
  limit: number;
  offset: number;
  searchTerm: string;
}>;

export interface City {
  id: number;
  name: string;
  nameAscii: string;
  country: string;
  countryIso3: string;
  capital: string;
  population: number;
}

@Injectable({
  providedIn: 'root',
})
export class CitiesService {
  private collator = new Intl.Collator('en', { sensitivity: 'base' });

  constructor() {}

  getCities({
    limit = 10000,
    offset = 0,
    searchTerm,
  }: SearchOptions = {}): Observable<City[]> {
    // Convert to observable to be consistent with Angular's HTTP pattern
    return from(this.getCitiesAsync({ limit, offset, searchTerm }));
  }

  private async getCitiesAsync({
    limit = 10000,
    offset = 0,
    searchTerm,
  }: SearchOptions = {}): Promise<City[]> {
    let filteredList: CityRaw[];

    if (!searchTerm) {
      filteredList = cities;
    } else {
      if (this.collator.compare(searchTerm, 'error') === 0) {
        throw new Error('Something terrible just happened!');
      }

      filteredList = cities.filter(
        (c: CityRaw): boolean =>
          // City name
          this.collator.compare(c[2], searchTerm) === 0 ||
          // Country name
          this.collator.compare(c[3], searchTerm) === 0
      );
    }

    return filteredList.slice(offset, offset + limit).map((row: CityRaw) => ({
      id: row[0],
      name: row[1],
      nameAscii: row[2],
      country: row[3],
      countryIso3: row[4],
      capital: row[5],
      population: row[6],
    }));
  }
}
