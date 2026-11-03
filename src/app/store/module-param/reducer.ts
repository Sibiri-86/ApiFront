import { createReducer, on, Action } from '@ngrx/store';
import * as featureActions from './action';
import { ModuleParam } from './model';
import { ModuleParamState } from './state';

const initialState: ModuleParamState = {
  moduleParams: [], 
};

const featureReducer = createReducer<ModuleParamState>(
  initialState,
  on(featureActions.setModuleParam, (state, { moduleParams }): ModuleParamState => {
    return {
      ...state,
      moduleParams: moduleParams
    };
  }),
);

export function Modulereducer(state: ModuleParamState | undefined, action: Action): ModuleParamState {
  return featureReducer(state, action);
}