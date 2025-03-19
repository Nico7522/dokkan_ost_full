import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  isMenuClosed = signal(false);
  closeMenu() {
    this.isMenuClosed.set(false);
  }

  openMenu() {
    this.isMenuClosed.set(true);
  }
}
