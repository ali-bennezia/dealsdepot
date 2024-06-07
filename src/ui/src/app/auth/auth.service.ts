import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { UserLoginOutboundDto } from './data/dtos/outbound/user-login-outbound-dto';
import { environment } from 'src/environments/environment';

import { Observable, of, Subject } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthOperationResult } from './data/auth-operation-result';
import { AuthSession } from './data/auth-session';
import { UserRegisterOutboundDto } from './data/dtos/outbound/user-register-outbound-dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private onLoginSource: Subject<AuthSession> = new Subject();
  private onRegisterSource: Subject<void> = new Subject();
  private onLogoutSource: Subject<void> = new Subject();

  onLogin$: Observable<AuthSession> = this.onLoginSource.asObservable();
  onRegister$: Observable<void> = this.onRegisterSource.asObservable();
  onLogout$: Observable<void> = this.onLogoutSource.asObservable();

  constructor(private http: HttpClient) {}

  tryFetchSession() {
    let previousSess = localStorage.getItem('session');
    if (previousSess) {
      this._session = JSON.parse(previousSess);
    }
  }

  saveSession() {
    if (this._session != null) {
      localStorage.setItem('session', JSON.stringify(this._session));
    } else {
      localStorage.removeItem('session');
    }
  }

  private _session: AuthSession | null = null;

  get session(): AuthSession | null {
    return this._session;
  }

  set session(val: AuthSession | null) {
    this._session = val;
    this.saveSession();
  }

  get isAuthenticated(): boolean {
    return this._session !== null;
  }

  get isAnonymous(): boolean {
    return this._session === null;
  }

  getProfilePictureSource(): string {
    return this.isAnonymous || this.session!.profilePictureFileName == null
      ? '/assets/images/anonymous-profile.png'
      : `${environment.backendUri}/content/image/${
          this.session!.profilePictureFileName
        }`;
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
            this.session = data.body;
            if (this._session != null) this.onLoginSource.next(this._session);
            return of({
              success: true,
              status: data.status,
            });
          } else return of(data);
        })
      );
  }

  logout() {
    this.session = null;
    this.onLogoutSource.next();
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
            this.onRegisterSource.next();
            return of({
              success: true,
              status: data.status,
            });
          } else return of(data);
        })
      );
  }
}
