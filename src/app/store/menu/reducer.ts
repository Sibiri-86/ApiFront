import { createReducer, on, Action } from '@ngrx/store';
import * as featureActions from './action';
import { MenuAction } from './model';
import { MenuActionState } from './state';

const initialState: MenuActionState = {
  menuActions: [], 
};

const featureReducer = createReducer<MenuActionState>(
  initialState,
  on(featureActions.setMenuAction, (state, { menuActions }): MenuActionState => {
    return {
      ...state,
      menuActions: menuActions
    };
  }),
);

export function Menureducer(state: MenuActionState | undefined, action: Action): MenuActionState {
  return featureReducer(state, action);
}