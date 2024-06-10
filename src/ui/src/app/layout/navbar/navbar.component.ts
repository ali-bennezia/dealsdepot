import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

import 'flowbite';
import { Subscription } from 'rxjs';

import { Flowbite } from 'src/app/utils/flowbiteUtils';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  encapsulation: ViewEncapsulation.None,
})
@Flowbite()
export class NavbarComponent {
  onClickSignOut = (e: Event) => {
    this.authService.logout();
    this.router.navigate(['/signin']);
  };

  constructor(public authService: AuthService, private router: Router) {}
}
