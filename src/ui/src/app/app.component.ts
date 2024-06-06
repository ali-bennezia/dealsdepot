import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  title = 'ui';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    initFlowbite();
  }
}
