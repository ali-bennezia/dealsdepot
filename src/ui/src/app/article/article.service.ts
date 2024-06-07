import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './../auth/auth.service';
import {
  ArticleCreateOutboundDto,
  getFormData,
} from './data/dtos/outbound/article/article-create-outbound-dto';
import { ArticleOperationResult } from './data/article-operation-result';
import { ArticleInboundDto } from './data/dtos/inbound/article-inbound-dto';
import { environment } from 'src/environments/environment';

import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  create(
    article: ArticleCreateOutboundDto,
    files: File[]
  ): Observable<ArticleOperationResult> {
    let formData = getFormData(article, files);
    return this.http
      .post<ArticleInboundDto>(
        `${environment.backendUri}/api/article`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${this.authService.session?.token}`,
          },
          observe: 'response',
        }
      )
      .pipe(
        catchError((err) => {
          return of({
            success: false,
            status: err.status,
            data: err.body,
          });
        }),
        switchMap((resp) => {
          if (resp instanceof HttpResponse) {
            return of({
              success: true,
              status: resp.status,
              data: resp.body,
            });
          } else return of(resp);
        })
      );
  }
}