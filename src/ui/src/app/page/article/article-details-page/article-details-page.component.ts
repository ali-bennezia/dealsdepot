import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from 'src/app/article/article.service';
import { ArticleInboundDto } from 'src/app/article/data/dtos/inbound/article-inbound-dto';
import { AuthService } from 'src/app/auth/auth.service';
import { getMediaLink } from 'src/app/utils/mediaUtils';

@Component({
  selector: 'app-article-details-page',
  templateUrl: './article-details-page.component.html',
  styleUrls: ['./article-details-page.component.css'],
})
export class ArticleDetailsPageComponent {
  getMediaLink = getMediaLink;
  loading: boolean = false;
  article: ArticleInboundDto | null = null;

  fetchArticle(id: string) {
    this.loading = true;
    this.articleService.getArticle(id).subscribe((result) => {
      if (result.success) {
        this.article = result.data;
      } else {
        //TODO: Handle error
      }
      this.loading = false;
    });
  }

  onAccessLink(ev: Event) {
    this.articleService.addClick(this.article!.id).subscribe((res) => {});
  }

  onClickVoteFor(ev: Event) {
    let previousUserChoice: boolean | null = this.article!.votes.userChoice;

    this.articleService.setVote(this.article!.id, true).subscribe((res) => {
      if (res.success) {
        this.article!.votes.userChoice = true;
        ++this.article!.votes.for;
        if (previousUserChoice != null) {
          if (previousUserChoice === true) --this.article!.votes.for;
          else --this.article!.votes.against;
        }
      } else {
        //TODO: Handle error
      }
    });
  }
  onClickVoteAgainst(ev: Event) {
    let previousUserChoice: boolean | null = this.article!.votes.userChoice;

    this.articleService.setVote(this.article!.id, false).subscribe((res) => {
      if (res.success) {
        this.article!.votes.userChoice = false;
        ++this.article!.votes.against;
        if (previousUserChoice != null) {
          if (previousUserChoice === true) --this.article!.votes.for;
          else --this.article!.votes.against;
        }
      } else {
        //TODO: Handle error
      }
    });
  }

  constructor(
    activatedRoute: ActivatedRoute,
    private articleService: ArticleService,
    private authService: AuthService
  ) {
    activatedRoute.paramMap.subscribe((params) => {
      if (params.has('id')) {
        this.fetchArticle(params.get('id')!);
      } else {
        //TODO: Handle error
      }
    });
  }
}
