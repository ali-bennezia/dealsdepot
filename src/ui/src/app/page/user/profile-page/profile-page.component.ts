import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthOperationResult } from 'src/app/auth/data/auth-operation-result';
import { UserProfileInboundDto } from 'src/app/auth/data/dtos/inbound/user-profile-inbound-dto';
import { getMediaLink } from 'src/app/utils/mediaUtils';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  profile: UserProfileInboundDto | null = null;

  getMediaLink = getMediaLink;

  constructor(public authService: AuthService) {}

  private profileSubscription: Subscription | null = null;
  cleanupSubscription() {
    if (this.profileSubscription != null) {
      this.profileSubscription.unsubscribe();
      this.profileSubscription = null;
    }
  }
  ngOnInit(): void {
    this.cleanupSubscription();
    this.profileSubscription = this.authService
      .getProfile()
      .subscribe((res: AuthOperationResult) => {
        if (res.success) {
          this.profile = res.data;
        } else {
          //TODO: Handle error
        }
      });
  }

  ngOnDestroy(): void {
    this.cleanupSubscription();
  }
}
