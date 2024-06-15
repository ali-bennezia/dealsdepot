import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/article/article.service';
import { ArticleOperationResult } from 'src/app/article/data/article-operation-result';
import { ArticleInboundDto } from 'src/app/article/data/dtos/inbound/article-inbound-dto';

import { Flowbite } from 'src/app/utils/flowbiteUtils';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
@Flowbite()
export class HomePageComponent implements OnInit {
  loading: boolean = false;
  articles: ArticleInboundDto[] = [];

  fetchArticlesFromParams(params: Record<string, string>) {
    this.loading = true;
    this.articleService
      .getArticles(params)
      .subscribe((res: ArticleOperationResult) => {
        if (res.success) {
          this.articles = res.data.results;
        } else {
          //TODO: Handle error
        }
        this.loading = false;
      });
  }

  fetchMostViewed() {
    let params: Record<string, string> = {};
    params['page'] = '1';
    params['sortBy'] = 'views';
    params['sortOrder'] = '-1';
    this.fetchArticlesFromParams(params);
  }

  fetchMostClicked() {
    let params: Record<string, string> = {};
    params['page'] = '1';
    params['sortBy'] = 'clicks';
    params['sortOrder'] = '-1';
    this.fetchArticlesFromParams(params);
  }

  fetchMostRecent() {
    let params: Record<string, string> = {};
    params['page'] = '1';
    params['sortBy'] = 'createdAt';
    params['sortOrder'] = '-1';
    this.fetchArticlesFromParams(params);
  }

  tab: number = 1;
  setTab(val: number) {
    this.tab = val;
    switch (this.tab) {
      case 1:
        this.fetchMostViewed();
        break;
      case 2:
        this.fetchMostClicked();
        break;
      case 3:
        this.fetchMostRecent();
        break;
      default:
        break;
    }
  }

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.setTab(1);
  }
}
