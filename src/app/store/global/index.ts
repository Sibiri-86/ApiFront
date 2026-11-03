import {
    ActionReducer,
    ActionReducerMap,
    createFeatureSelector,
    createSelector,
    MetaReducer
} from '@ngrx/store';

import * as profilReducer from '../profil/reducer';
import * as globaleStateReducer from '../global-config/reducer';
import * as profilState from '../profil/state';
import { AppState } from '../app.state';


export const reducers: ActionReducerMap<AppState> = {
    profilState: profilReducer.reducer,
    globalState: globaleStateReducer.reducer,
    

};

  
  // console.log all actions
export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
    return function(state, action) {
        console.log('state', state);
        console.log('action', action);
        return reducer(state, action);
    };
}
export const metaReducers: MetaReducer<AppState>[] =  [debug] ;