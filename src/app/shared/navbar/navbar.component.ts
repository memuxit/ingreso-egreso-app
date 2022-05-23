import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../app.reducer';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {
  nombre = '';
  userSubs: Subscription;

  constructor(
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.userSubs = this.store.select('auth')
      .pipe(filter(({user}) => user != null))
      .subscribe(({user}) => this.nombre = user.nombre);
  }

  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
  }

}
