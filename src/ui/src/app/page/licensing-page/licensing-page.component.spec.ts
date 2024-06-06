import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicensingPageComponent } from './licensing-page.component';

describe('LicensingPageComponent', () => {
  let component: LicensingPageComponent;
  let fixture: ComponentFixture<LicensingPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LicensingPageComponent]
    });
    fixture = TestBed.createComponent(LicensingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
