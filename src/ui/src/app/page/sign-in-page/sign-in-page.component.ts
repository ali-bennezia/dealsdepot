import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

import { UserLoginOutboundDto } from 'src/app/auth/data/dtos/outbound/user-login-outbound-dto';
import { AuthOperationResult } from 'src/app/auth/data/auth-operation-result';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.css'],
})
export class SignInPageComponent {
  group!: FormGroup;
  loading: boolean = false;
  constructor(
    builder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.group = builder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false, [Validators.required]],
    });
  }

  getDTO(): UserLoginOutboundDto {
    return this.group.value;
  }

  handleError(status: number) {}

  onSubmit = (e: Event) => {
    this.loading = true;
    this.authService
      .login(this.getDTO())
      .subscribe((result: AuthOperationResult) => {
        if (result.success) {
          this.router.navigate(['/']);
        } else {
          this.handleError(result.status);
        }
        this.loading = false;
      });
  };
}
