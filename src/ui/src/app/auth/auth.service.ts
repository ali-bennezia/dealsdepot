import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { UserLoginOutboundDto } from './data/dtos/outbound/user-login-outbound-dto';
import { environment } from 'src/environments/environment';

import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthOperationResult } from './data/auth-operation-result';
import { AuthSession } from './data/auth-session';
import { UserRegisterOutboundDto } from './data/dtos/outbound/user-register-outbound-dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  private _session: AuthSession | null = null;

  get isAuthenticated(): boolean {
    return this._session !== null;
  }

  get isAnonymous(): boolean {
    return this._session === null;
  }

  login(dto: UserLoginOutboundDto): Observable<AuthOperationResult> {
    return this.http
      .post<AuthSession>(`${environment.backendUri}/api/user/signin`, dto, {
        headers: {
          'Content-Type': 'application/json',
        },
        observe: 'response',
      })
      .pipe(
        catchError((err) => {
          return of({
            success: false,
            status: err.status,
          });
        }),
        switchMap((data) => {
          if (data instanceof HttpResponse) {
            this._session = data.body;
            return of({
              success: true,
              status: data.status,
            });
          } else return of(data);
        })
      );
  }

  logout() {
    this._session = null;
  }

  register(dto: UserRegisterOutboundDto): Observable<AuthOperationResult> {
    return this.http
      .post<AuthSession>(`${environment.backendUri}/api/user/register`, dto, {
        headers: {
          'Content-Type': 'application/json',
        },
        observe: 'response',
      })
      .pipe(
        catchError((err) => {
          return of({
            success: false,
            status: err.status,
          });
        }),
        switchMap((data) => {
          if (data instanceof HttpResponse) {
            return of({
              success: true,
              status: data.status,
            });
          } else return of(data);
        })
      );
  }
}
