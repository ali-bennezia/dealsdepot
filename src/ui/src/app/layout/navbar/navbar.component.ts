import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

import 'flowbite';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent {
  onClickSignOut = (e: Event) => {
    this.authService.logout();
    this.router.navigate(['/signin']);
  };

  showUserMenu: boolean = false;
  toggleUserMenu = (e: Event) => {
    this.showUserMenu = !this.showUserMenu;
  };

  constructor(public authService: AuthService, private router: Router) {}
}
