import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';

interface NavElement {
  label: string;
  relativePath: string;
}

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  isDropdownOpen = false;

  navElements: NavElement[] = [
    { label: 'Home', relativePath: '/' },
    { label: 'About', relativePath: '/about' },
    { label: 'Services', relativePath: '/services' },
    { label: 'Contact', relativePath: '/contact' },
  ];

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
