import { ErrorComponent } from './common/error/error.component';
import { catchError } from 'rxjs/operators';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
  constructor(private dialog: MatDialog) {}

  //error interceptor
  intercept(req:HttpRequest<any>, next:HttpHandler){
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        let errorMessage = error.error.message? error.error.message : 'An unknown error has occured'

        this.dialog.open(ErrorComponent, {data: {message:errorMessage}})
        return throwError(error)
      })
    )
  }

}
