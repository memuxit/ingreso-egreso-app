import {ActionReducerMap} from '@ngrx/store';
import * as ui from '../app/shared/ui.reducer';
import * as auh from '../app/auth/auth.reducer';

export interface AppState {
  ui: ui.State;
  auth: auh.State;
}

export const appReducers: ActionReducerMap<AppState> = {
  ui: ui.uiReducer,
  auth: auh.authReducer,
};
