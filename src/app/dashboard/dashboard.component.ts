import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../app.reducer';
import {filter} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {IngresoEgresoService} from '../services/ingreso-egreso.service';
import * as actions from '../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit, OnDestroy {
  userSubs: Subscription;
  ingresosSubs: Subscription;

  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService,
  ) {
  }

  ngOnInit(): void {
    this.userSubs = this.store.select('auth')
      .pipe(filter(auth => auth.user !== null))
      .subscribe(({user}) => {
        this.ingresosSubs = this.ingresoEgresoService.initIngresosEgresosListener(user.uid)
          .subscribe(ingresosEgresosFB => {
            this.store.dispatch(actions.setItems({items: ingresosEgresosFB}));
          });
      });
  }

  ngOnDestroy(): void {
    this.ingresosSubs.unsubscribe();
    this.userSubs.unsubscribe();
  }

}
