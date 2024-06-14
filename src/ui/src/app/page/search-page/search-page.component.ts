import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  Observable,
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs';
import { ArticleService } from 'src/app/article/article.service';
import { ArticlePaginationResultsDto } from 'src/app/article/data/dtos/inbound/article-pagination-results-dto';
import { AuthService } from 'src/app/auth/auth.service';

import { Flowbite } from 'src/app/utils/flowbiteUtils';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css'],
})
@Flowbite()
export class SearchPageComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private articleService: ArticleService
  ) {}

  loading: boolean = false;
  articles: ArticlePaginationResultsDto = {
    totalDocs: 0,
    limit: 10,
    totalPages: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
    pagingCounter: 0,
    results: [],
  };

  query: string = '';
  sortOrder: string = '';
  sortBy: string = '';
  tags: string = '';
  page: number = 1;
  setPage(p: number) {
    this.page = p;
    this.fetchArticles(this.query);
  }

  onSearchQuerySource: Subject<string> = new Subject();
  onSearchQuery$: Observable<string> = this.onSearchQuerySource
    .asObservable()
    .pipe(distinctUntilChanged(), debounceTime(300));
  onSearchQuerySubscription: Subscription | null = null;

  fetchArticles(
    query?: string,
    sortBy?: string,
    sortOrder?: string,
    tags?: string
  ) {
    let queryParam = query ?? this.query;
    let sortByParam = sortBy ?? this.sortBy;
    let sortOrderParam = sortOrder ?? this.sortOrder;
    let tagsParam = tags ?? this.tags;

    this.loading = true;
    let params: Record<string, string> = {};

    params['page'] = String(this.page);
    if (queryParam.trim() != '') params['query'] = queryParam;
    if (sortByParam.trim() != '' && sortOrderParam.trim() != '') {
      params['sortBy'] = sortByParam;
      params['sortOrder'] = sortOrderParam;
    }
    if (tagsParam.trim() != '') {
      let tagsArray = tagsParam.split(', ');
      params['tags'] = JSON.stringify(tagsArray);
    }

    this.articleService.getArticles(params).subscribe((res) => {
      if (res.success) {
        this.articles = res.data;
      } else {
        // TODO: Handle error
      }
      this.loading = false;
      initFlowbite();
    });
  }

  onSearchInput(ev: Event) {
    let inp: HTMLInputElement = ev.target as HTMLInputElement;
    this.onSearchQuerySource.next(inp.value);
  }

  onSortByInput(ev: Event) {
    let inp: HTMLInputElement = ev.target as HTMLInputElement;
    this.sortBy = inp.value;
    this.fetchArticles(undefined, inp.value, undefined);
  }

  onSortOrderInput(ev: Event) {
    let inp: HTMLInputElement = ev.target as HTMLInputElement;
    this.sortOrder = inp.value;
    this.fetchArticles(undefined, undefined, inp.value);
  }

  onTagsInput(ev: Event) {
    let inp: HTMLInputElement = ev.target as HTMLInputElement;
    this.tags = inp.value;
    this.fetchArticles(undefined, undefined, undefined, inp.value);
  }

  ngOnInit(): void {
    this.fetchArticles(this.query);
    if (this.onSearchQuerySubscription != null)
      this.onSearchQuerySubscription.unsubscribe();

    this.onSearchQuerySubscription = this.onSearchQuery$.subscribe((qry) => {
      this.query = qry;
      this.fetchArticles(qry);
    });
  }

  ngOnDestroy(): void {
    if (this.onSearchQuerySubscription != null) {
      this.onSearchQuerySubscription.unsubscribe();
      this.onSearchQuerySubscription = null;
    }
  }
}
