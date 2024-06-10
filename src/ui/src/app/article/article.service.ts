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
import { ParamMap } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private allowedFetchParams: string[] = [
    'query',
    'minclicks',
    'maxclicks',
    'minviews',
    'maxviews',
    'tags',
    'sortBy',
    'sortOrder',
    'page',
    'author',
  ];

  getArticles(params: ParamMap): Observable<ArticleOperationResult> {
    let searchParams = new URLSearchParams();
    for (let p of this.allowedFetchParams) {
      if (params.has(p)) {
        searchParams.append(p, params.get(p)!);
      }
    }
    let searchParamsStr = searchParams.toString();
    return this.http
      .get<ArticleInboundDto[]>(
        `${environment.backendUri}/api/article${
          searchParamsStr.trim() == '' ? '' : '?'
        }${searchParamsStr}`,
        {
          headers: {
            'Content-Type': 'application/json',
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

  getArticle(id: string): Observable<ArticleOperationResult> {
    return this.http
      .get<ArticleInboundDto>(`${environment.backendUri}/api/article/${id}`, {
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

  deleteMedia(
    id: string,
    mediaFileName: string
  ): Observable<ArticleOperationResult> {
    return this.http
      .delete<ArticleInboundDto>(
        `${environment.backendUri}/api/article/${id}/media/${mediaFileName}`,
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
