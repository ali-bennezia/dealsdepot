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

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomePageComponent,
    AboutPageComponent,
    NotFoundPageComponent,
    RegisterPageComponent,
    SignInPageComponent,
  ],
  imports: [BrowserModule, RouterModule.forRoot(ROUTES), HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
