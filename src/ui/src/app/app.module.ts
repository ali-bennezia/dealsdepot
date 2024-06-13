import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from './page/home-page/home-page.component';
import { AboutPageComponent } from './page/legal/about-page/about-page.component';
import { NotFoundPageComponent } from './page/not-found-page/not-found-page.component';
import { ROUTES } from './routing/routes';
import { RegisterPageComponent } from './page/user/register-page/register-page.component';
import { SignInPageComponent } from './page/user/sign-in-page/sign-in-page.component';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './layout/footer/footer.component';
import { PrivacyPolicyPageComponent } from './page/legal/privacy-policy-page/privacy-policy-page.component';
import { LicensingPageComponent } from './page/legal/licensing-page/licensing-page.component';
import { ContactPageComponent } from './page/legal/contact-page/contact-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfilePageComponent } from './page/user/profile-page/profile-page.component';
import { SettingsPageComponent } from './page/user/settings-page/settings-page.component';
import { SearchPageComponent } from './page/search-page/search-page.component';
import { ArticleAddPageComponent } from './page/article/article-add-page/article-add-page.component';
import { ArticleDetailsPageComponent } from './page/article/article-details-page/article-details-page.component';
import { ArticleListPageComponent } from './page/article/article-list-page/article-list-page.component';
import { NgIcon, NgIconsModule } from '@ng-icons/core';
import { ionTrash } from '@ng-icons/ionicons';
import { SpinnerComponent } from './misc/spinner/spinner.component';
import { PageSelectorComponent } from './misc/page-selector/page-selector.component';

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
    ProfilePageComponent,
    SettingsPageComponent,
    SearchPageComponent,
    ArticleAddPageComponent,
    ArticleDetailsPageComponent,
    ArticleListPageComponent,
    SpinnerComponent,
    PageSelectorComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgIconsModule.withIcons({ ionTrash }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
