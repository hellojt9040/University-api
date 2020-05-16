import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoutingModule } from './routing.module';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from './angular-material/angular-material.module';


import { AppComponent } from './app.component';
import { CreatePostComponent } from './posts/create-post/create-post.component';
import { HeaderComponent } from './common/header/header.component';
import { ViewPostsComponent } from './posts/view-posts/view-posts.component';
import { FileUploadComponent } from './common/upload/file-upload/file-upload.component';
import { EditPostComponent } from './posts/edit-post/edit-post.component';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { AboutUsComponent } from './common/about-us/about-us.component';
import { LoginComponent } from './common/auth/login/login.component';
import { SignupComponent } from '../app/common/auth/signup/signup.component'
import { ErrorComponent } from './common/error/error.component';
import { SafePipe } from './common/pipes/safe.pipe';


import { AuthInterseptor } from './common/auth/auth-interseptor';
import { ErrorInterceptor } from './error-interceptor';


@NgModule({
  declarations: [
    AppComponent,
    CreatePostComponent,
    HeaderComponent,
    ViewPostsComponent,
    FileUploadComponent,
    EditPostComponent,
    NotFoundComponent,
    AboutUsComponent,
    LoginComponent,
    SignupComponent,
    SafePipe,


  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RoutingModule,
    RouterModule,
    //angular-material module
    AngularMaterialModule,

  ],
  //multi TRUE says not to override, just add additional
  providers: [
    {provide:HTTP_INTERCEPTORS, useClass:AuthInterseptor, multi:true},
    {provide:HTTP_INTERCEPTORS, useClass:ErrorInterceptor, multi:true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
