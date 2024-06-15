import { Routes } from '@angular/router';
import { HomePageComponent } from '../page/home-page/home-page.component';
import { AboutPageComponent } from '../page/legal/about-page/about-page.component';
import { NotFoundPageComponent } from '../page/not-found-page/not-found-page.component';
import { RegisterPageComponent } from '../page/user/register-page/register-page.component';
import { SignInPageComponent } from '../page/user/sign-in-page/sign-in-page.component';
import { PrivacyPolicyPageComponent } from '../page/legal/privacy-policy-page/privacy-policy-page.component';
import { LicensingPageComponent } from '../page/legal/licensing-page/licensing-page.component';
import { ContactPageComponent } from '../page/legal/contact-page/contact-page.component';
import { ProfilePageComponent } from '../page/user/profile-page/profile-page.component';
import { SettingsPageComponent } from '../page/user/settings-page/settings-page.component';
import { SearchPageComponent } from '../page/search-page/search-page.component';
import { ArticleAddPageComponent } from '../page/article/article-add-page/article-add-page.component';
import { ArticleListPageComponent } from '../page/article/article-list-page/article-list-page.component';
import { ArticleDetailsPageComponent } from '../page/article/article-details-page/article-details-page.component';
import {
  isAnonymousCanActivateFn,
  isAuthenticatedCanActivateFn,
} from '../page/guards';
import { UserDetailsPageComponent } from '../page/user/user-details-page/user-details-page.component';

export const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomePageComponent,
  },
  {
    path: 'search',
    component: SearchPageComponent,
  },
  {
    path: 'article/add',
    component: ArticleAddPageComponent,
    canActivate: [isAuthenticatedCanActivateFn],
  },
  {
    path: 'article/list',
    component: ArticleListPageComponent,
    canActivate: [isAuthenticatedCanActivateFn],
  },
  {
    path: 'article/:id',
    component: ArticleDetailsPageComponent,
  },
  {
    path: 'register',
    component: RegisterPageComponent,
    canActivate: [isAnonymousCanActivateFn],
  },
  {
    path: 'signin',
    component: SignInPageComponent,
    canActivate: [isAnonymousCanActivateFn],
  },
  {
    path: 'profile',
    component: ProfilePageComponent,
    canActivate: [isAuthenticatedCanActivateFn],
  },
  {
    path: 'user/:id',
    component: UserDetailsPageComponent,
  },
  {
    path: 'settings',
    component: SettingsPageComponent,
    canActivate: [isAuthenticatedCanActivateFn],
  },
  {
    path: 'about',
    component: AboutPageComponent,
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyPageComponent,
  },
  {
    path: 'licensing',
    component: LicensingPageComponent,
  },
  {
    path: 'contact',
    component: ContactPageComponent,
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  },
];
