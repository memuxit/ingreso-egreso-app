import {ActionReducerMap} from '@ngrx/store';
import * as ui from '../app/shared/ui.reducer';
import * as auh from '../app/auth/auth.reducer';
import * as ingresoEgreso from './ingreso-egreso/ingreso-egreso.reducer';

export interface AppState {
  ui: ui.State;
  auth: auh.State;
  ingresosEgresos: ingresoEgreso.State;
}

export const appReducers: ActionReducerMap<AppState> = {
  ui: ui.uiReducer,
  auth: auh.authReducer,
  ingresosEgresos: ingresoEgreso.ingresoEgresoReducer,
};
