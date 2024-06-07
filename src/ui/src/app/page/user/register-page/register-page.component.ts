import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

import { UserLoginOutboundDto } from 'src/app/auth/data/dtos/outbound/user/user-login-outbound-dto';
import { AuthOperationResult } from 'src/app/auth/data/auth-operation-result';
import { Router } from '@angular/router';
import { UserRegisterOutboundDto } from 'src/app/auth/data/dtos/outbound/user/user-register-outbound-dto';

import { EqualFieldsValidator } from 'src/app/forms/validators';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
})
export class RegisterPageComponent {
  group!: FormGroup;
  loading: boolean = false;
  constructor(
    builder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.group = builder.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(25),
          ],
        ],
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
        confirmPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(128),
          ],
        ],
      },
      { validators: [new EqualFieldsValidator('password', 'confirmPassword')] }
    );
  }

  getDTO(): UserRegisterOutboundDto {
    return this.group.value;
  }

  errorDisplay: string = '';
  handleError(status: number) {
    switch (status) {
      case 400:
        this.errorDisplay = 'Bad request.';
        break;
      case 409:
        this.errorDisplay = 'Username or email already used.';
        break;
      default:
        this.errorDisplay = 'Internal server error.';
        break;
    }
  }

  onSubmit = (e: Event) => {
    this.loading = true;
    this.authService
      .register(this.getDTO())
      .subscribe((result: AuthOperationResult) => {
        if (result.success) {
          this.router.navigate(['/signin'], {
            queryParams: { registered: true },
          });
        } else {
          this.handleError(result.status);
        }
        this.loading = false;
      });
  };
}
