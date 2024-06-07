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
      email: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(320),
          Validators.email,
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(128),
        ],
      ],
      rememberMe: [false],
    });
  }

  getDTO(): UserLoginOutboundDto {
    return this.group.value;
  }

  errorDisplay: string = '';
  handleError(status: number) {
    switch (status) {
      case 401:
        this.errorDisplay = 'Incorrect credentials.';
        break;
      default:
        this.errorDisplay = 'Internal server error.';
        break;
    }
  }

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
