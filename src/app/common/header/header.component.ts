import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription
  userIsAuthenticated = false

  constructor(private authService: AuthService) { }

  ngOnInit(){
    this.userIsAuthenticated = this.authService.getIsAuth()
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated
      })
  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe()
  }

  //logout
  onLogout(){
    this.authService.logout()
  }

}
