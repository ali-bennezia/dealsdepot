import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

import 'flowbite';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent implements OnDestroy {
  onClickSignOut = (e: Event) => {
    this.authService.logout();
    this.router.navigate(['/signin']);
  };

  showUserMenu: boolean = false;
  toggleUserMenu = (e: Event) => {
    this.showUserMenu = !this.showUserMenu;
  };

  onLogoutSubscription!: Subscription;
  constructor(public authService: AuthService, private router: Router) {
    this.onLogoutSubscription = this.authService.onLogout$.subscribe(() => {
      this.showUserMenu = false;
    });
  }

  ngOnDestroy(): void {
    this.onLogoutSubscription.unsubscribe();
  }
}
