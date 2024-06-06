import { Routes } from '@angular/router';
import { HomePageComponent } from '../page/home-page/home-page.component';
import { AboutPageComponent } from '../page/about-page/about-page.component';
import { NotFoundPageComponent } from '../page/not-found-page/not-found-page.component';
import { RegisterPageComponent } from '../page/register-page/register-page.component';
import { SignInPageComponent } from '../page/sign-in-page/sign-in-page.component';
import { PrivacyPolicyPageComponent } from '../page/privacy-policy-page/privacy-policy-page.component';
import { LicensingPageComponent } from '../page/licensing-page/licensing-page.component';
import { ContactPageComponent } from '../page/contact-page/contact-page.component';

export const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomePageComponent,
  },

  {
    path: 'register',
    component: RegisterPageComponent,
  },
  {
    path: 'signin',
    component: SignInPageComponent,
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
