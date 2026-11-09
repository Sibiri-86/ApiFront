import { Action, createReducer, on } from '@ngrx/store';
import * as featureActions from './action';
import { OperateurState, initialOperateurState } from './state';

const featureReducer = createReducer<OperateurState>(
  initialOperateurState,
  on(featureActions.setOperateur, (state, { operateurs }): OperateurState => ({
    ...state,
    operateurs
  }))
);

export function OperateurReducer(state: OperateurState | undefined, action: Action): OperateurState {
  return featureReducer(state, action);
}
