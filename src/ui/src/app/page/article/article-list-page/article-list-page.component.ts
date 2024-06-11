import { HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ParamMap, Params, convertToParamMap } from '@angular/router';

import { ArticleService } from 'src/app/article/article.service';
import { ArticleInboundDto } from 'src/app/article/data/dtos/inbound/article-inbound-dto';
import { AuthService } from 'src/app/auth/auth.service';

import { Flowbite } from 'src/app/utils/flowbiteUtils';
import { getMediaLink } from 'src/app/utils/mediaUtils';

@Component({
  selector: 'app-article-list-page',
  templateUrl: './article-list-page.component.html',
  styleUrls: ['./article-list-page.component.css'],
})
@Flowbite()
export class ArticleListPageComponent implements OnInit {
  public getMediaLink: (fileName: string) => string = getMediaLink;

  articles: ArticleInboundDto[] = [];
  loading: boolean = false;
  loadingEditedArticle: boolean = false;
  page: number = 1;

  editedArticle: ArticleInboundDto | null = null;
  editForm = {
    title: '',
    tags: '',
    link: '',
    content: '',
  };

  constructor(
    private authService: AuthService,
    private articleService: ArticleService,
    builder: FormBuilder
  ) {}

  fetchArticles() {
    this.loading = true;
    let params: URLSearchParams = new URLSearchParams();
    params.append('author', this.authService.session!.id);
    params.append('page', String(this.page));
    let paramMap: ParamMap = convertToParamMap(params);
    this.articleService.getArticles(paramMap).subscribe((res) => {
      if (res.success) {
        this.articles = res.data;
      } else {
        // TODO: Handle error
      }
      this.loading = false;
    });
  }

  refetchEditedArticle() {
    if (!this.editedArticle) return;
    this.loadingEditedArticle = true;
    this.articleService.getArticle(this.editedArticle.id).subscribe((res) => {
      if (res.success) {
        this.editedArticle = res.data;
        let i = this.articles.findIndex((a) => a.id == this.editedArticle!.id);
        if (i >= 0) this.articles[i] = res.data;
      } else {
        // TODO: Handle error
      }
      this.loadingEditedArticle = false;
    });
  }

  ngOnInit(): void {
    this.fetchArticles();
  }

  editModuleFetchArticleValues() {
    this.editForm.title = this.editedArticle?.title ?? '';
    this.editForm.tags = this.editedArticle?.tags.join(', ') ?? '';
    this.editForm.link = this.editedArticle?.link ?? '';
    this.editForm.content = this.editedArticle?.content ?? '';
  }

  onClickEditArticle(article: ArticleInboundDto) {
    this.editedArticle = article;
    this.editModuleFetchArticleValues();
  }

  onClickArticleMediaDelete(article: ArticleInboundDto, mediaFileName: string) {
    this.articleService
      .deleteMedia(article.id, mediaFileName)
      .subscribe((res) => {
        if (res.success) {
          this.refetchEditedArticle();
        } else {
          //TODO: Handle error
        }
      });
  }

  onDragOverEditMedia = (ev: Event) => {
    ev.preventDefault();
  };

  onDropEditMedia = (article: ArticleInboundDto, ev: Event) => {
    ev.preventDefault();
    let dropEv = ev as DragEvent;
    let files: File[] = [...((dropEv.dataTransfer?.files as any) ?? [])];
    this.addArticleMedias(article, files);
  };

  onChangeEditMedia = (article: ArticleInboundDto, ev: Event) => {
    ev.preventDefault();
    let inp = ev.target as HTMLInputElement;
    let files: File[] = [...(inp.files == null ? [] : (inp.files as any))];
    this.addArticleMedias(article, files);
  };

  addArticleMedias = (article: ArticleInboundDto, files: File[]) => {
    this.articleService.createMedias(article.id, files).subscribe((results) => {
      results.forEach((res) => {
        if (!res.success) {
          //TODO: Handle error
        }
      });
      this.refetchEditedArticle();
    });
  };
}
