
import {props, createAction} from '@ngrx/store';
import { Status} from './model';
export const SetStatus = createAction('[App Init] set status', props<{status:Status}>());
