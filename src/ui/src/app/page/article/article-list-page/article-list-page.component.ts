import { HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ParamMap, Params, convertToParamMap } from '@angular/router';

import { ArticleService } from 'src/app/article/article.service';
import { ArticleInboundDto } from 'src/app/article/data/dtos/inbound/article-inbound-dto';
import { AuthService } from 'src/app/auth/auth.service';

import { Flowbite } from 'src/app/utils/flowbiteUtils';

@Component({
  selector: 'app-article-list-page',
  templateUrl: './article-list-page.component.html',
  styleUrls: ['./article-list-page.component.css'],
})
@Flowbite()
export class ArticleListPageComponent implements OnInit {
  articles: ArticleInboundDto[] = [];
  loading: boolean = false;
  page: number = 1;

  constructor(
    private authService: AuthService,
    private articleService: ArticleService
  ) {}

  fetchArticles() {
    this.loading = true;
    let params: URLSearchParams = new URLSearchParams();
    params.append('author', this.authService.session!.id);
    params.append('page', String(this.page));
    let paramMap: ParamMap = convertToParamMap(params);
    this.articleService.getArticles(paramMap).subscribe((data) => {
      this.articles = data;
      this.loading = false;
    });
  }

  ngOnInit(): void {
    this.fetchArticles();
  }
}
