import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-page-selector',
  templateUrl: './page-selector.component.html',
  styleUrls: ['./page-selector.component.css'],
})
export class PageSelectorComponent {
  @Input()
  page!: number;
  @Output()
  onSelectPage: EventEmitter<number> = new EventEmitter<number>();

  getCursorPosition(): number {
    if (this.page == 1) return this.page;
    else return 2;
  }

  getMiddlePage(): number {
    if (this.page == 1) return 2;
    else return this.page;
  }

  onClickPage(targetPage: number) {
    this.onSelectPage.emit(targetPage);
  }
}
