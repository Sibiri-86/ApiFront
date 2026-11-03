import { createReducer, on, Action } from '@ngrx/store';
import { Status, StatusEnum} from './model';
import {GlobalState} from './state';
import { SetStatus } from './action';

const initialState : GlobalState = {
    status: {
        status: StatusEnum.success,  
        message: ''      
      }
};

const featureReducer = createReducer(
  initialState,
  on(SetStatus, (state, action) => ({
    ...state,
    status: action.status  
  }))
);

export function GlobalConfigreducer(state: GlobalState | undefined, action: Action) {
  return featureReducer(state, action);
}