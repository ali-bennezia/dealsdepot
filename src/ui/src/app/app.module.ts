import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from './page/home-page/home-page.component';
import { AboutPageComponent } from './page/about-page/about-page.component';
import { NotFoundPageComponent } from './page/not-found-page/not-found-page.component';
import { ROUTES } from './routing/routes';
import { RegisterPageComponent } from './page/register-page/register-page.component';
import { SignInPageComponent } from './page/sign-in-page/sign-in-page.component';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './layout/footer/footer.component';
import { PrivacyPolicyPageComponent } from './page/privacy-policy-page/privacy-policy-page.component';
import { LicensingPageComponent } from './page/licensing-page/licensing-page.component';
import { ContactPageComponent } from './page/contact-page/contact-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomePageComponent,
    AboutPageComponent,
    NotFoundPageComponent,
    RegisterPageComponent,
    SignInPageComponent,
    FooterComponent,
    PrivacyPolicyPageComponent,
    LicensingPageComponent,
    ContactPageComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
