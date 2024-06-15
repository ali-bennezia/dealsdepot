import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

import { AuthOperationResult } from 'src/app/auth/data/auth-operation-result';
import { Subscription } from 'rxjs';
import { UserInboundDto } from 'src/app/auth/data/dtos/inbound/user-inbound-dto';
import { ActivatedRoute } from '@angular/router';
import { getMediaLink } from 'src/app/utils/mediaUtils';

@Component({
  selector: 'app-user-details-page',
  templateUrl: './user-details-page.component.html',
  styleUrls: ['./user-details-page.component.css'],
})
export class UserDetailsPageComponent implements OnDestroy {
  getMediaLink = getMediaLink;
  loading: boolean = false;
  user: UserInboundDto | null = null;
  constructor(
    private authService: AuthService,
    activatedRoute: ActivatedRoute
  ) {
    activatedRoute.paramMap.subscribe((params) => {
      this.fetchUserData(params.get('id')!);
    });
  }

  private profileSubscription: Subscription | null = null;
  cleanupSubscription() {
    if (this.profileSubscription != null) {
      this.profileSubscription.unsubscribe();
      this.profileSubscription = null;
    }
  }
  fetchUserData(id: string) {
    this.cleanupSubscription();
    this.loading = true;
    this.profileSubscription = this.authService
      .getUserById(id)
      .subscribe((res: AuthOperationResult) => {
        if (res.success) {
          this.user = res.data;
        } else {
          this.user = null;
          //TODO: Handle error
        }
        this.loading = false;
      });
  }

  ngOnDestroy(): void {
    this.cleanupSubscription();
  }
}
