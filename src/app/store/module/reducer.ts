import { createReducer, on, Action } from '@ngrx/store';
import * as featureActions from './action';
import { Profil } from './model';
import { ProfilState } from './state';

const initialState: ProfilState = {
  profils: [], 
};

const featureReducer = createReducer<ProfilState>(
  initialState,
  on(featureActions.setProfil, (state, { profils }): ProfilState => {
    return {
      ...state,
      profils: profils
    };
  }),
);

export function reducer(state: ProfilState | undefined, action: Action): ProfilState {
  return featureReducer(state, action);
}