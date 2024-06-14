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

import { Observable, of, forkJoin } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { ParamMap } from '@angular/router';
import { ArticleEditOutboundDto } from './data/dtos/outbound/article/article-edit-outbound-dto';

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

  getArticles(
    params: Record<string, string>
  ): Observable<ArticleOperationResult> {
    let searchParams = new URLSearchParams();
    for (let p of this.allowedFetchParams) {
      if (p in params) {
        searchParams.append(p, params[p]);
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

  getArticle(id: string): Observable<ArticleOperationResult> {
    return this.http
      .get<ArticleInboundDto>(`${environment.backendUri}/api/article/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authService.session?.token}`,
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

  createArticle(
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

  editArticle(
    articleId: string,
    article: ArticleEditOutboundDto
  ): Observable<ArticleOperationResult> {
    return this.http
      .patch<ArticleInboundDto>(
        `${environment.backendUri}/api/article/${articleId}`,
        article,
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

  deleteArticle(articleId: string): Observable<ArticleOperationResult> {
    return this.http
      .delete(`${environment.backendUri}/api/article/${articleId}`, {
        headers: {
          Authorization: `Bearer ${this.authService.session?.token}`,
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

  createMedias(
    id: string,
    files: File[]
  ): Observable<ArticleOperationResult[]> {
    return forkJoin(
      files.map((f) => {
        let formData = new FormData();
        formData.append('file', f);
        return this.http
          .post<string>(
            `${environment.backendUri}/api/article/${id}/media`,
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
      })
    );
  }

  addClick(id: string): Observable<ArticleOperationResult> {
    return this.http
      .post(
        `${environment.backendUri}/api/article/${id}`,
        {},
        {
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

  setVote(id: string, vote: boolean): Observable<ArticleOperationResult> {
    return this.http
      .post(
        `${environment.backendUri}/api/article/${id}/vote/${vote}`,
        {},
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

  deleteVote(id: string): Observable<ArticleOperationResult> {
    return this.http
      .delete(`${environment.backendUri}/api/article/${id}/vote`, {
        headers: {
          Authorization: `Bearer ${this.authService.session?.token}`,
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
}
