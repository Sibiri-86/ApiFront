import {props, createAction} from '@ngrx/store';
import { ModuleParam } from './model';
export const createModuleParam = createAction('[App Init] Create ModuleParam', props<ModuleParam>());
export const updateModuleParam = createAction('[App Init] update ModuleParam', props<ModuleParam>());
export const deleteModuleParam = createAction('[App Init] delete ModuleParam', props<ModuleParam>());
export const deleteModuleParams = createAction('[App Init] delete ModuleParams', props<{moduleParams: Array<ModuleParam>}>());
export const loadModuleParam = createAction('[App Init] load ModuleParams');
export const setModuleParam = createAction('[App Init] set ModuleParam',  props<{moduleParams: ModuleParam[]}>());
