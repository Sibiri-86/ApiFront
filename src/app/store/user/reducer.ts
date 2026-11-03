import { createReducer, on, Action } from '@ngrx/store';
import * as featureActions from './action';
import { User } from './model';
import { UserState } from './state';

const initialState: UserState = {
  users: [], 
};

const featureReducer = createReducer<UserState>(
  initialState,
  on(featureActions.setUser, (state, { users }): UserState => {
    return {
      ...state,
      users: users
    };
  }),
);

export function UserReducer(state: UserState | undefined, action: Action): UserState {
  return featureReducer(state, action);
}