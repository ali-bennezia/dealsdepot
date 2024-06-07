import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleAddPageComponent } from './article-add-page.component';

describe('ArticleAddPageComponent', () => {
  let component: ArticleAddPageComponent;
  let fixture: ComponentFixture<ArticleAddPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleAddPageComponent]
    });
    fixture = TestBed.createComponent(ArticleAddPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
