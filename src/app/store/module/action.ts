import {props, createAction} from '@ngrx/store';
import { Module, ModuleList } from './model';
export const createModule = createAction('[App Init] Create Module', props<Module>());
export const updateModule = createAction('[App Init] update Module', props<Module>());
export const deleteModule = createAction('[App Init] delete Module', props<Module>());
export const deleteModuleList = createAction('[App Init] delete Module', props<{ModuleList: Array<Module>}>());
export const loadModule = createAction('[App Init] load Profils');
export const setModule = createAction('[App Init] set Profil',  props<{module: Module[]}>());
