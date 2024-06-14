import { Component, Input } from '@angular/core';
import { ArticleService } from 'src/app/article/article.service';
import { ArticleInboundDto } from 'src/app/article/data/dtos/inbound/article-inbound-dto';
import { getMediaLink } from 'src/app/utils/mediaUtils';

@Component({
  selector: 'app-article-display',
  templateUrl: './article-display.component.html',
  styleUrls: ['./article-display.component.css'],
})
export class ArticleDisplayComponent {
  @Input()
  article!: ArticleInboundDto;

  constructor(private articleService: ArticleService) {}

  getMediaLink = getMediaLink;

  onClickVoteFor(ev: Event) {
    let previousUserChoice: boolean | null = this.article.votes.userChoice;

    this.articleService.setVote(this.article.id, true).subscribe((res) => {
      if (res.success) {
        this.article.votes.userChoice = true;
        ++this.article.votes.for;
        if (previousUserChoice != null) {
          if (previousUserChoice === true) --this.article.votes.for;
          else --this.article.votes.against;
        }
      } else {
        //TODO: Handle error
      }
    });
  }
  onClickVoteAgainst(ev: Event) {
    let previousUserChoice: boolean | null = this.article.votes.userChoice;

    this.articleService.setVote(this.article.id, false).subscribe((res) => {
      if (res.success) {
        this.article.votes.userChoice = false;
        ++this.article.votes.against;
        if (previousUserChoice != null) {
          if (previousUserChoice === true) --this.article.votes.for;
          else --this.article.votes.against;
        }
      } else {
        //TODO: Handle error
      }
    });
  }
}
