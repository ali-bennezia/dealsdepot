import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

import { Router } from '@angular/router';
import { ArticleCreateOutboundDto } from 'src/app/article/data/dtos/outbound/article/article-create-outbound-dto';
import { HttpClient } from '@angular/common/http';
import { ArticleService } from 'src/app/article/article.service';
import { ArticleOperationResult } from 'src/app/article/data/article-operation-result';

@Component({
  selector: 'app-article-add-page',
  templateUrl: './article-add-page.component.html',
  styleUrls: ['./article-add-page.component.css'],
})
export class ArticleAddPageComponent {
  @ViewChild('fileInput', { read: ElementRef, static: true })
  fileInputElement!: ElementRef<HTMLInputElement>;

  group!: FormGroup;
  loading: boolean = false;
  constructor(
    builder: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private articleService: ArticleService,
    private router: Router
  ) {
    this.group = builder.group({
      link: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(256),
        ],
      ],
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(64),
        ],
      ],
      content: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(256),
        ],
      ],
      files: [[]],
      tags: ['', [Validators.minLength(0), Validators.maxLength(128)]],
    });
  }

  getDTO(): ArticleCreateOutboundDto {
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
    let fileList = this.fileInputElement.nativeElement.files as any;
    let files: File[] = [...fileList];
    this.articleService
      .createArticle(this.getDTO(), files)
      .subscribe((result: ArticleOperationResult) => {
        if (result.success) {
          if (result.data) {
            this.router.navigate(['article', result.data.id], {
              queryParams: { created: true },
            });
          } else
            this.router.navigate(['article', 'list'], {
              queryParams: { created: true },
            });
        } else {
          this.handleError(result.status);
        }
        this.loading = false;
      });
  };
}
