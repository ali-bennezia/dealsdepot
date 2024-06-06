import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { AuthService } from './auth/auth.service';
import { AuthOperationResult } from './auth/data/auth-operation-result';
import { UserLoginOutboundDto } from './auth/data/dtos/outbound/user-login-outbound-dto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'ui';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    initFlowbite();
  }
}
